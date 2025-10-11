"use client";

import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserFullResponse } from "@/lib/api-client";
import { apiClient, getUserDetailsApiUsersUserIdGet } from "@/lib/api-client";
import { ChannelLogo } from "./channel-logo";
import { JsonViewer } from "./json-viewer";

interface UserInfoDrawerProps {
  userId: string;
}

export function UserInfoDrawer({ userId }: UserInfoDrawerProps) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const response = await getUserDetailsApiUsersUserIdGet({
        client: apiClient,
        path: { user_id: userId },
      });
      return response.data as UserFullResponse;
    },
    enabled: !!userId,
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="w-80 border-l flex flex-col shrink-0 bg-background">
      {/* Header */}
      <div className="h-16 px-4 border-b shrink-0 flex items-center">
        <h3 className="text-sm font-semibold">User Information</h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : user ? (
          <>
            {/* User ID */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground pb-1.5 border-b">
                USER ID
              </h3>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-muted px-2 py-1 rounded flex-1 truncate">
                  {user.id}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                  onClick={() => copyToClipboard(user.id, "User ID")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground pb-1.5 border-b">
                BASIC INFORMATION
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user.email || "-"}</span>
                </div>
              </div>
            </div>

            {/* Channels */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground pb-1.5 border-b">
                CHANNELS
              </h3>
              {user.channels.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No connected channels
                </p>
              ) : (
                <div className="space-y-2">
                  {user.channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-start gap-2.5 p-2 rounded-md bg-muted/50"
                    >
                      <ChannelLogo
                        channelType={channel.channel_type}
                        size={20}
                      />
                      <div className="flex-1 min-w-0 text-sm">
                        <div className="font-medium capitalize">
                          {channel.channel_type}
                          {channel.is_primary && (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              (Primary)
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {channel.channel_id}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground pb-1.5 border-b">
                PROFILE
              </h3>
              {Object.keys(user.profile).length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No additional information
                </p>
              ) : (
                <div className="text-sm">
                  <JsonViewer data={user.profile} />
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-muted-foreground">User not found</p>
        )}
      </div>
    </div>
  );
}
