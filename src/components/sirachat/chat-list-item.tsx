"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types";

type ChatListItemProps = {
  partner: UserProfile;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
};

export default function ChatListItem({
  partner,
  lastMessage,
  time,
  unreadCount = 0,
  isActive = false,
}: ChatListItemProps) {
  const hasUnread = unreadCount > 0;
  const isOnline = partner.status === 'online';

  return (
    <div className={cn(
        "flex items-center gap-3 p-3 transition-colors cursor-pointer",
        isActive ? "bg-muted" : "hover:bg-muted/50"
    )}>
      <div className="relative">
        <Avatar className="h-14 w-14 flex-shrink-0">
            <AvatarImage src={partner.avatarUrl} alt={partner.username} />
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {partner.username.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
        {isOnline && (
            <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold truncate text-foreground">{partner.username}</h2>
          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className={cn(
            "text-sm truncate",
            hasUnread ? "text-foreground font-semibold" : "text-muted-foreground"
          )}>
            {lastMessage}
          </p>
          <div className="flex items-center gap-1.5 ml-2">
            {hasUnread && (
              <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
