"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ConversationListItem } from "@/components/conversations/conversation-list-item";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { ConversationListItem as Conversation } from "@/lib/api-client";

// Stable keys for skeleton loaders
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5"];

interface ConversationListPanelProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isFetchingMore: boolean;
}

export function ConversationListPanel({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  hasMore,
  onLoadMore,
  isFetchingMore,
}: ConversationListPanelProps) {
  return (
    <div className="w-80 border-r flex flex-col shrink-0">
      <div className="h-16 px-4 border-b shrink-0 flex items-center">
        <h1 className="text-lg font-semibold">Conversations</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {SKELETON_KEYS.map((key) => (
              <Skeleton key={key} className="h-24 w-full" />
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p>No conversations yet</p>
          </div>
        ) : (
          <>
            <AnimatePresence mode="popLayout" initial={false}>
              {conversations.map((conversation) => (
                <motion.div
                  key={conversation.id}
                  layout
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    layout: {
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    },
                    opacity: { duration: 0.2 },
                    y: { duration: 0.2 },
                    x: { duration: 0.2 },
                  }}
                >
                  <ConversationListItem
                    conversation={conversation}
                    isSelected={conversation.id === selectedConversationId}
                    onClick={() => onSelectConversation(conversation.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {hasMore && (
              <div className="p-4">
                <Button
                  onClick={onLoadMore}
                  disabled={isFetchingMore}
                  variant="outline"
                  className="w-full"
                >
                  {isFetchingMore ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
