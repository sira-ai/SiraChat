
"use client";

import { useEffect, useRef } from "react";
import type { Message, UserProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";

type MessageListProps = {
  messages: Message[];
  currentUser: UserProfile | null;
  onUserSelect: (senderId: string) => void;
};

export default function MessageList({ messages, currentUser, onUserSelect }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (viewportRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = viewportRef.current;
      // If user is near the bottom, auto-scroll
      if (scrollHeight - scrollTop < clientHeight + 300) { // Increased threshold
        setTimeout(() => {
            if (scrollRef.current) {
                // Use scrollIntoView with block: 'end' to ensure it goes to the very bottom
                scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
            }
        }, 100);
      }
    }
  }, [messages]);
  
  // Scrolls to bottom on initial load
  useEffect(() => {
    if (viewportRef.current) {
      setTimeout(() => {
          if (scrollRef.current) {
              scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
          }
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollArea className="h-full w-full p-4" viewportRef={viewportRef}>
        <div className="flex flex-col gap-2">
            {messages.map((message) => (
                <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUser?.uid}
                onUserSelect={onUserSelect}
                />
            ))}
            <div ref={scrollRef} />
        </div>
    </ScrollArea>
  );
}
