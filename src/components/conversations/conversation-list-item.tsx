import { formatDistanceToNow } from "date-fns";
import type { ConversationListItem as ConversationType } from "@/lib/api-client";
import { ChannelBadge } from "./channel-badge";
import { SenderBadge } from "./sender-badge";

interface ConversationListItemProps {
  conversation: ConversationType;
  isSelected: boolean;
  onClick: () => void;
}

export function ConversationListItem({
  conversation,
  isSelected,
  onClick,
}: ConversationListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-b hover:bg-accent transition-all duration-200 ease-in-out ${
        isSelected ? "bg-accent border-l-4 border-l-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <ChannelBadge channelType={conversation.channel_type} />
          <span className="font-semibold truncate">
            {conversation.user.name}
          </span>
        </div>
        {conversation.last_message && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDistanceToNow(
              new Date(conversation.last_message.created_at),
              {
                addSuffix: true,
              },
            )}
          </span>
        )}
      </div>

      {conversation.last_message && (
        <div className="flex items-start gap-2">
          <SenderBadge role={conversation.last_message.sender_role} />
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {conversation.last_message.content}
          </p>
        </div>
      )}
    </button>
  );
}
