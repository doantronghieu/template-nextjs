"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { UserInfoDrawer } from "@/components/conversations/user-info-drawer";
import { config } from "@/config";
import type {
  ConversationHistoryResponse,
  ConversationListResponse,
  MessageHistoryItem,
} from "@/lib/api-client";
import {
  apiClient,
  createMessageApiMessagesPost,
  getAllConversationsApiConversationsGet,
  getConversationMessagesApiConversationsMessagesPost,
} from "@/lib/api-client";
import { ConversationListPanel } from "./components/conversation-list-panel";
import { MessagePanel } from "./components/message-panel";

const DRAWER_STORAGE_KEY = "conversations-user-drawer-open";

export default function ConversationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const selectedConversationId = searchParams.get("id");
  const [messageInput, setMessageInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load drawer state from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(DRAWER_STORAGE_KEY);
    if (stored !== null) {
      setIsDrawerOpen(stored === "true");
    }
  }, []);

  // Save drawer state to localStorage
  const toggleDrawer = () => {
    setIsDrawerOpen((prev) => {
      const newState = !prev;
      localStorage.setItem(DRAWER_STORAGE_KEY, String(newState));
      return newState;
    });
  };

  // Fetch conversations with infinite scroll
  const {
    data: conversationsData,
    fetchNextPage: fetchNextConversations,
    hasNextPage: hasMoreConversations,
    isFetchingNextPage: isFetchingMoreConversations,
    isLoading: isLoadingConversations,
  } = useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const response = await getAllConversationsApiConversationsGet({
        client: apiClient,
        query: { limit: 50, cursor: pageParam },
      });
      return response.data as ConversationListResponse;
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    refetchInterval: config.conversationPollingInterval,
    refetchIntervalInBackground: false,
    initialPageParam: undefined as string | undefined,
  });

  // Fetch messages for selected conversation
  const {
    data: messagesData,
    fetchNextPage: fetchNextMessages,
    hasNextPage: hasMoreMessages,
    isFetchingNextPage: isFetchingMoreMessages,
    isLoading: isLoadingMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", selectedConversationId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      if (!selectedConversationId) throw new Error("No conversation selected");
      const response =
        await getConversationMessagesApiConversationsMessagesPost({
          client: apiClient,
          body: {
            conversation_id: selectedConversationId,
            limit: 50,
            before_message_id: pageParam,
            order: "created_at.desc",
            reverse: true,
          },
        });
      return response.data as ConversationHistoryResponse;
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
    enabled: !!selectedConversationId,
    refetchInterval: selectedConversationId
      ? config.messagePollingInterval
      : false,
    refetchIntervalInBackground: false,
    initialPageParam: undefined as string | undefined,
  });

  // Send message mutation with optimistic update
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedConversationId) throw new Error("No conversation selected");

      const conversation = conversationsData?.pages
        .flatMap((page: ConversationListResponse) => page.conversations)
        .find((c) => c.id === selectedConversationId);

      if (!conversation) throw new Error("Conversation not found");

      const response = await createMessageApiMessagesPost({
        client: apiClient,
        body: {
          user_id: conversation.user.id,
          conversation_id: selectedConversationId,
          sender_role: "admin",
          content,
        },
      });
      return response.data;
    },
    onMutate: async (content) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["messages", selectedConversationId],
      });

      // Optimistic message
      const optimisticMessage: MessageHistoryItem = {
        role: "admin",
        content,
        created_at: new Date().toISOString(),
      };

      // Optimistically update UI
      queryClient.setQueryData<{
        pages: ConversationHistoryResponse[];
        pageParams: unknown[];
      }>(["messages", selectedConversationId], (old) => {
        if (!old) return old;

        const lastPage = old.pages[old.pages.length - 1];
        return {
          ...old,
          pages: [
            ...old.pages.slice(0, -1),
            {
              ...lastPage,
              conversation_history: [
                ...lastPage.conversation_history,
                optimisticMessage,
              ],
            },
          ],
        };
      });

      return { optimisticMessage };
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast.error("Failed to send message");
      queryClient.invalidateQueries({
        queryKey: ["messages", selectedConversationId],
      });
    },
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && messagesData) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  // Handle conversation selection
  const handleSelectConversation = (conversationId: string) => {
    router.push(`/admin/conversations?id=${conversationId}`);
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedConversationId) return;
    sendMessageMutation.mutate(messageInput);
  };

  // Flatten conversations from all pages
  const allConversations =
    conversationsData?.pages.flatMap(
      (page: ConversationListResponse) => page.conversations,
    ) || [];

  // Flatten messages from all pages (map to component-expected format)
  const allMessages =
    messagesData?.pages.flatMap((page: ConversationHistoryResponse) =>
      page.conversation_history.map((msg) => ({
        id: `${msg.created_at}-${msg.role}`,
        content: msg.content,
        sender_role: msg.role as "client" | "admin" | "ai",
        created_at: msg.created_at,
      })),
    ) || [];

  // Get selected conversation
  const selectedConversation = allConversations.find(
    (c) => c.id === selectedConversationId,
  );

  return (
    <div className="flex h-[calc(100vh-3.5rem)] relative">
      <ConversationListPanel
        conversations={allConversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        isLoading={isLoadingConversations}
        hasMore={hasMoreConversations}
        onLoadMore={fetchNextConversations}
        isFetchingMore={isFetchingMoreConversations}
      />

      <MessagePanel
        selectedConversation={selectedConversation}
        messages={allMessages}
        isLoading={isLoadingMessages}
        hasMore={hasMoreMessages}
        onLoadMore={fetchNextMessages}
        isFetchingMore={isFetchingMoreMessages}
        messageInput={messageInput}
        onMessageInputChange={setMessageInput}
        onSendMessage={handleSendMessage}
        isSending={sendMessageMutation.isPending}
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={toggleDrawer}
        messagesEndRef={messagesEndRef}
        messagesContainerRef={messagesContainerRef}
      />

      {selectedConversation && isDrawerOpen && (
        <UserInfoDrawer userId={selectedConversation.user.id} />
      )}
    </div>
  );
}
