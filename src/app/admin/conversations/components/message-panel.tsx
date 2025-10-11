"use client";

import { PanelRightClose, PanelRightOpen, Send } from "lucide-react";
import { AISummaryCard } from "@/components/conversations/ai-summary-card";
import { MessageBubble } from "@/components/conversations/message-bubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConversationListItem as Conversation } from "@/lib/api-client";

type SenderRole = "client" | "admin" | "ai";
type MessageStatus = "sending" | "sent" | "error";

interface Message {
  id: string;
  content: string;
  sender_role: SenderRole;
  created_at: string;
  status?: MessageStatus;
}

// Stable keys for skeleton loaders
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface MessagePanelProps {
  selectedConversation: Conversation | undefined;
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isFetchingMore: boolean;
  messageInput: string;
  onMessageInputChange: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isSending: boolean;
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  messagesContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function MessagePanel({
  selectedConversation,
  messages,
  isLoading,
  hasMore,
  onLoadMore,
  isFetchingMore,
  messageInput,
  onMessageInputChange,
  onSendMessage,
  isSending,
  isDrawerOpen,
  onToggleDrawer,
  messagesEndRef,
  messagesContainerRef,
}: MessagePanelProps) {
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <p>Select a conversation to view messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Toggle Button */}
        <div className="h-16 px-4 border-b shrink-0 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold truncate">
              {selectedConversation.title}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {selectedConversation.user.name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleDrawer}
            className="ml-4 shrink-0"
          >
            {isDrawerOpen ? (
              <>
                <PanelRightClose className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Hide Info</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">User Info</span>
              </>
            )}
          </Button>
        </div>

        {/* AI Summary */}
        {selectedConversation.ai_summary &&
          selectedConversation.ai_summary_updated_at && (
            <AISummaryCard
              summary={selectedConversation.ai_summary}
              updatedAt={selectedConversation.ai_summary_updated_at}
            />
          )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
          {isLoading ? (
            <div className="space-y-4">
              {SKELETON_KEYS.map((key) => (
                <Skeleton key={key} className="h-16 w-3/4" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages in this conversation</p>
            </div>
          ) : (
            <>
              {hasMore && (
                <div className="mb-4 text-center">
                  <Button
                    onClick={onLoadMore}
                    disabled={isFetchingMore}
                    variant="outline"
                    size="sm"
                  >
                    {isFetchingMore ? "Loading..." : "Load Older Messages"}
                  </Button>
                </div>
              )}

              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isFromAdmin={
                    message.sender_role === "admin" ||
                    message.sender_role === "ai"
                  }
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t shrink-0">
          <form onSubmit={onSendMessage} className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => onMessageInputChange(e.target.value)}
              placeholder="Type a message..."
              disabled={isSending}
            />
            <Button type="submit" disabled={!messageInput.trim() || isSending}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
