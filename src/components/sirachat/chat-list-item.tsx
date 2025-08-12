"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ChatListItemProps = {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isActive?: boolean;
  dataAiHint?: string;
};

export default function ChatListItem({
  avatar,
  name,
  lastMessage,
  time,
  unreadCount = 0,
  isActive = false,
  dataAiHint
}: ChatListItemProps) {
  const hasUnread = unreadCount > 0;

  return (
    <div className={cn(
        "flex items-center gap-3 p-3 transition-colors cursor-pointer",
        isActive ? "bg-muted" : "hover:bg-muted/50"
    )}>
      <Avatar className="h-14 w-14 flex-shrink-0">
          <>
            <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint}/>
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold truncate text-foreground">{name}</h2>
          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className={cn(
            "text-sm truncate",
            hasUnread ? "text-foreground font-bold" : "text-muted-foreground"
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