import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChannelLogo } from "./channel-logo";

interface ChannelBadgeProps {
  channelType: string | null;
}

export function ChannelBadge({ channelType }: ChannelBadgeProps) {
  if (!channelType) return null;

  const formattedChannel =
    channelType.charAt(0).toUpperCase() + channelType.slice(1);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-1.5 cursor-help">
          <ChannelLogo channelType={channelType} size={20} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto p-2 text-xs" side="top">
        Connected via {formattedChannel}
      </HoverCardContent>
    </HoverCard>
  );
}
