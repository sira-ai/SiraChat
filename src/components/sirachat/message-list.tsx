
"use client";

import { useEffect, useRef } from "react";
import type { Message, UserProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";

type MessageListProps = {
  messages: Message[];
  currentUser: UserProfile | null;
  chatPartner: UserProfile | null;
  onUserSelect: (senderId: string) => void;
};

export default function MessageList({ messages, currentUser, chatPartner, onUserSelect }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            const { scrollHeight, clientHeight, scrollTop } = viewport;
            // If user is near the bottom, auto-scroll
            if (scrollHeight - scrollTop < clientHeight + 300) { // Increased threshold
                setTimeout(() => {
                    if (endOfMessagesRef.current) {
                        // Use scrollIntoView with block: 'end' to ensure it goes to the very bottom
                        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }, 100);
            }
        }
    }
  }, [messages]);
  
  // Scrolls to bottom on initial load
  useEffect(() => {
    setTimeout(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollArea className="h-full w-full p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
            {messages.map((message) => (
                <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUser?.uid}
                onUserSelect={onUserSelect}
                partnerAvatar={chatPartner?.avatarUrl}
                />
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    </ScrollArea>
  );
}
