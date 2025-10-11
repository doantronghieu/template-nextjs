import { MessageSquare } from "lucide-react";
import Image from "next/image";

interface ChannelLogoProps {
  channelType: string | null;
  size?: number;
}

const channelLogos: Record<string, string> = {
  instagram: "/logos/instagram.png",
  messenger: "/logos/messenger.png",
  telegram: "/logos/telegram.png",
  tiktok: "/logos/tiktok.png",
  whatsapp: "/logos/whatsapp.png",
  zalo: "/logos/zalo.png",
};

export function ChannelLogo({ channelType, size = 20 }: ChannelLogoProps) {
  if (!channelType) {
    return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
  }

  const normalizedChannel = channelType.toLowerCase();
  const logoPath = channelLogos[normalizedChannel];

  if (!logoPath) {
    return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={logoPath}
        alt={`${channelType} logo`}
        width={size}
        height={size}
        className="rounded-sm object-contain"
        priority={false}
      />
    </div>
  );
}
