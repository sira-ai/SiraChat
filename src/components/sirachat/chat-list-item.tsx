
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BellOff, Volume2 } from "lucide-react";
import Image from "next/image";

type ChatListItemProps = {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isMuted?: boolean;
  isTyping?: boolean;
  isArchived?: boolean;
  dataAiHint?: string;
};

export default function ChatListItem({
  avatar,
  name,
  lastMessage,
  time,
  unreadCount = 0,
  isMuted = false,
  isTyping = false,
  isArchived = false,
  dataAiHint
}: ChatListItemProps) {
  const hasUnread = unreadCount > 0;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-card/50 transition-colors cursor-pointer">
      <Avatar className="h-14 w-14 flex-shrink-0">
         {avatar.startsWith('http') ? (
            <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint}/>
         ) : (
            <Image src={avatar} alt={name} width={56} height={56} className={cn("p-2", !isArchived && "bg-muted rounded-full")} />
         )}
        <AvatarFallback className="text-xl bg-primary text-primary-foreground">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold truncate text-foreground">{name}</h2>
          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className={cn(
            "text-sm truncate",
            isTyping ? "text-primary" : "text-muted-foreground"
          )}>
            {lastMessage}
          </p>
          <div className="flex items-center gap-1.5 ml-2">
            {isMuted && <BellOff className="h-4 w-4 text-muted-foreground" />}
            {hasUnread && (
              <Badge className="h-6 min-w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
