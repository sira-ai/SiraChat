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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);

  return (
    <ScrollArea className="h-full w-full p-4">
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
