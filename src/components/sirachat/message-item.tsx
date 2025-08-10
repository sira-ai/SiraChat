"use client";

import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from 'date-fns';

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
};

function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    if(isToday(date)) {
        return format(date, 'p');
    }
    if(isYesterday(date)) {
        return `Yesterday at ${format(date, 'p')}`;
    }
    return format(date, 'MMM d, yyyy, p');
}


export default function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const { text, sender, timestamp } = message;

  return (
    <div
      className={cn(
        "flex items-end gap-2 animate-in fade-in-25 slide-in-from-bottom-4 duration-500",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-accent text-accent-foreground">
            {sender.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-2xl px-4 py-2", 
        isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none"
      )}>
        {!isCurrentUser && (
          <p className="text-xs font-bold text-accent-foreground">{sender}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        <p className={cn("text-xs mt-1 text-right", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
}
