"use client";

import * as React from "react";
import { Send, User, Bot, Trash2, RotateCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
  timestamp: number;
}

interface ChatbotProps {
  apiUrl?: string;
  onSendMessage?: (message: string) => Promise<string>;
  className?: string;
}

interface ChatbotRef {
  clearMessages: () => void;
  addMessage: (role: "user" | "assistant", content: string) => void;
}

const STORAGE_KEY = "chatbot-messages";

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const Chatbot = React.forwardRef<ChatbotRef, ChatbotProps>(
  ({ apiUrl, onSendMessage, className }, ref) => {
    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = React.useState(false);

    // Load messages from localStorage on mount
    React.useEffect(() => {
      setMounted(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setMessages(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse stored messages:", e);
        }
      }
    }, []);

    // Save messages to localStorage
    React.useEffect(() => {
      if (mounted) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      }
    }, [messages, mounted]);

    // Auto-scroll to bottom
    React.useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, isLoading]);

    const sendMessage = React.useCallback(
      async (userMessage: string, isRetry = false) => {
        if (!userMessage.trim() || isLoading) return;

        const now = Date.now();
        const userMsg: Message = {
          id: now.toString(),
          role: "user",
          content: userMessage.trim(),
          timestamp: now,
        };

        // Add user message if not retry
        if (!isRetry) {
          setMessages((prev) => [...prev, userMsg]);
          setInput("");
        }

        setIsLoading(true);

        try {
          let response: string;

          if (onSendMessage) {
            response = await onSendMessage(userMessage.trim());
          } else {
            const customUrl = apiUrl || process.env.NEXT_PUBLIC_BACKEND_URL;
            const isDummyJSON = !customUrl;

            const url = customUrl || "https://dummyjson.com/quotes/random";

            const res = await fetch(url, {
              method: isDummyJSON ? "GET" : "POST",
              headers: isDummyJSON
                ? undefined
                : { "Content-Type": "application/json" },
              body: isDummyJSON
                ? undefined
                : JSON.stringify({ message: userMessage.trim() }),
            });

            if (!res.ok) throw new Error("API request failed");

            const data = await res.json();
            response = data.response || data.quote || "No response";
          }

          const responseTime = Date.now();
          setMessages((prev) => [
            ...prev,
            {
              id: responseTime.toString(),
              role: "assistant",
              content: response,
              timestamp: responseTime,
            },
          ]);
        } catch (error) {
          const errorTime = Date.now();
          setMessages((prev) => [
            ...prev,
            {
              id: errorTime.toString(),
              role: "assistant",
              content: "Failed to get response. Please try again.",
              error: true,
              timestamp: errorTime,
            },
          ]);
        } finally {
          setIsLoading(false);
        }
      },
      [apiUrl, onSendMessage, isLoading],
    );

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(input);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage(input);
      }
    };

    const clearMessages = React.useCallback(() => {
      setMessages([]);
      localStorage.removeItem(STORAGE_KEY);
    }, []);

    const addMessage = React.useCallback(
      (role: "user" | "assistant", content: string) => {
        const now = Date.now();
        setMessages((prev) => [
          ...prev,
          { id: now.toString(), role, content, timestamp: now },
        ]);
      },
      [],
    );

    const handleRetry = (messageContent: string) => {
      // Remove the error message
      setMessages((prev) => prev.slice(0, -1));
      sendMessage(messageContent, true);
    };

    React.useImperativeHandle(ref, () => ({
      clearMessages,
      addMessage,
    }));

    return (
      <div
        className={cn(
          "flex flex-col border rounded-xl bg-card shadow-sm",
          className,
        )}
      >
        <ChatbotHeader onClear={clearMessages} />
        <ChatbotMessages
          messages={messages}
          isLoading={isLoading}
          onRetry={handleRetry}
          scrollRef={scrollRef}
        />
        <ChatbotInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>
    );
  },
);

Chatbot.displayName = "Chatbot";

function ChatbotHeader({ onClear }: { onClear: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h3 className="font-semibold">Chat</h3>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon-sm" onClick={onClear}>
              <Trash2 className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear messages</TooltipContent>
        </Tooltip>
      </div>
      <Separator />
    </>
  );
}

function ChatbotMessages({
  messages,
  isLoading,
  onRetry,
  scrollRef,
}: {
  messages: Message[];
  isLoading: boolean;
  onRetry: (content: string) => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <ScrollArea className="flex-1 px-6 py-4">
      <div className="space-y-4">
        {messages.map((message, idx) => (
          <ChatbotMessage
            key={message.id}
            message={message}
            onRetry={onRetry}
            previousMessage={idx > 0 ? messages[idx - 1] : undefined}
          />
        ))}
        {isLoading && (
          <div className="flex gap-2">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback>
                <Bot className="size-4" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2 max-w-[75%]">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
}

function ChatbotMessage({
  message,
  onRetry,
  previousMessage,
}: {
  message: Message;
  onRetry: (content: string) => void;
  previousMessage?: Message;
}) {
  const isUser = message.role === "user";
  const previousUserMessage =
    previousMessage?.role === "user" ? previousMessage.content : "";

  return (
    <div className={cn("flex gap-2", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback>
            <Bot className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div className="flex flex-col gap-1.5 max-w-[75%]">
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 shadow-sm break-words",
            isUser
              ? "bg-primary text-primary-foreground ml-auto"
              : message.error
                ? "bg-destructive/10 border border-destructive"
                : "bg-card border",
          )}
        >
          <p className="text-sm">{message.content}</p>
        </div>
        <div
          className={cn(
            "flex items-center gap-2",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          <Badge
            variant="outline"
            className="text-[10px] py-0 h-4 bg-transparent"
          >
            {formatTime(message.timestamp)}
          </Badge>
          {message.error && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRetry(previousUserMessage)}
                  className="h-6 px-2 text-xs"
                >
                  <RotateCw className="size-3 mr-1" />
                  Retry
                </Button>
              </TooltipTrigger>
              <TooltipContent>Retry this message</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="size-8 shrink-0">
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

function ChatbotInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  disabled: boolean;
}) {
  return (
    <>
      <Separator />
      <form onSubmit={onSubmit} className="px-6 py-4">
        <div className="flex gap-2 items-start">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            className="flex-1 min-h-9 max-h-[200px] resize-none py-2"
            rows={1}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="submit"
                size="icon"
                disabled={disabled || !value.trim()}
              >
                <Send className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </form>
    </>
  );
}

export { Chatbot, type ChatbotRef };
