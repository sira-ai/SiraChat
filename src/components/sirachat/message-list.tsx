"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";

type MessageListProps = {
  messages: Message[];
  currentUser: string;
};

export default function MessageList({ messages, currentUser }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
     if (viewportRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = viewportRef.current;
      // If user is near the bottom, auto-scroll
      if (scrollHeight - scrollTop < clientHeight + 200) {
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 100);
      }
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full p-4" viewportRef={viewportRef}>
        <div className="space-y-4">
            {messages.map((message) => (
                <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.sender === currentUser}
                />
            ))}
            <div ref={scrollRef} />
        </div>
    </ScrollArea>
  );
}
