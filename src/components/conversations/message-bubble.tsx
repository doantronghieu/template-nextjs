import { format, isToday, isYesterday } from "date-fns";
import { AlertCircle, Check, Clock } from "lucide-react";
import { SenderBadge } from "./sender-badge";

type SenderRole = "client" | "admin" | "ai";
type MessageStatus = "sending" | "sent" | "error";

interface Message {
  id: string;
  content: string;
  sender_role: SenderRole;
  created_at: string;
  status?: MessageStatus;
}

interface MessageBubbleProps {
  message: Message;
  isFromAdmin: boolean;
}

const StatusIcon = ({ status }: { status?: Message["status"] }) => {
  if (!status || status === "sent") {
    return <Check className="h-3 w-3 text-green-600" />;
  }
  if (status === "sending") {
    return <Clock className="h-3 w-3 text-muted-foreground animate-pulse" />;
  }
  return <AlertCircle className="h-3 w-3 text-destructive" />;
};

const formatMessageTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isToday(date)) {
    return `Today ${format(date, "p")}`;
  }
  if (isYesterday(date)) {
    return `Yesterday ${format(date, "p")}`;
  }
  return format(date, "MMM d, p");
};

export function MessageBubble({ message, isFromAdmin }: MessageBubbleProps) {
  return (
    <div
      className={`flex gap-2 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300 ${isFromAdmin ? "justify-end" : "justify-start"}`}
    >
      {!isFromAdmin && <SenderBadge role={message.sender_role} />}

      <div
        className={`max-w-[70%] ${isFromAdmin ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isFromAdmin
              ? "bg-primary text-primary-foreground"
              : message.sender_role === "ai"
                ? "bg-purple-100 dark:bg-purple-900"
                : "bg-muted"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>

        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <span>{formatMessageTime(message.created_at)}</span>
          {isFromAdmin && <StatusIcon status={message.status} />}
        </div>
      </div>

      {isFromAdmin && <SenderBadge role={message.sender_role} />}
    </div>
  );
}
