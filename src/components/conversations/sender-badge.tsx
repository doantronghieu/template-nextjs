import { Bot, Shield, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SenderRole = "client" | "admin" | "ai";

interface SenderBadgeProps {
  role: SenderRole;
  size?: "sm" | "md";
}

const roleConfig = {
  client: {
    icon: User,
    label: "Client",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  ai: {
    icon: Bot,
    label: "AI Assistant",
    className:
      "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  admin: {
    icon: Shield,
    label: "Admin",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
} as const;

export function SenderBadge({ role, size = "sm" }: SenderBadgeProps) {
  const { icon: Icon, label, className } = roleConfig[role];
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar className={`${sizeClass} ${className}`}>
            <AvatarFallback className={`${className} border-0`}>
              <Icon className={iconSize} />
            </AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
