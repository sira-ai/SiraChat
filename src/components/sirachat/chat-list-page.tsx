
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Search, Pencil } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";

type ChatListPageProps = {
  username: string;
  onLogout: () => void;
};

// A mock list of chats for UI purposes, inspired by the user's screenshot
const mockChats = [
    { id: '1', name: 'Arsip Obrolan', lastMessage: 'DINOMERAH | #VIRAL, DINOK...', time: '', unread: 10, isArchived: true, avatar: '/stickers/archive.png' },
    { id: '2', name: 'Ibra Decode [ Front End ]', lastMessage: 'ibraa.web.id', time: '28 Jul', unread: 0, isMuted: true, avatar: 'https://placehold.co/100x100.png' , dataAiHint: 'man portrait' },
    { id: '3', name: 'XMsbra', lastMessage: 'Anda: inpo take', time: 'Sel', unread: 0, avatar: 'https://placehold.co/100x100.png', dataAiHint: 'code screen' },
    { id: '4', name: 'GC XMBSRA', lastMessage: 'bergabung ke grup الدولي العرباوي', time: 'Sel', unread: 0, isMuted: true, avatar: '/stickers/group-logo.png' },
    { id: '5', name: 'Ibra Decode', lastMessage: 'Anda: inpo take', time: 'Sel', unread: 0, isMuted: true, avatar: 'https://placehold.co/100x100.png', dataAiHint: 'dark portrait' },
    { id: '6', name: 'BotFather', lastMessage: 'Done! Congratulations on y...', time: '27 Jul', unread: 0, avatar: 'https://placehold.co/100x100.png', dataAiHint: 'robot suit' },
    { id: '7', name: 'MΣTHӨD ПΣЩខ { CHAT }', lastMessage: '... মিস্টার mengetik', time: '00:32', unread: 11, avatar: '/stickers/mw-logo.png', isTyping: true },
    { id: '8', name: 'ΜΣΤΉΘΟ ΠΣЩЕ { ОТР}', lastMessage: 'Rose: —Hello 👋', time: '00:30', unread: 110, avatar: '/stickers/mw-logo.png' },
    { id: '9', name: 'CH SHER MT VIP FREE🔥', lastMessage: 'Murband pv @Asepband -1 or...', time: '00:28', unread: 60, avatar: 'https://placehold.co/100x100.png', dataAiHint: 'girl cat' },
];

export default function ChatListPage({ username, onLogout }: ChatListPageProps) {
  return (
    <div className="flex h-screen w-screen flex-col bg-background relative">
        <header className="flex items-center justify-between p-3 shadow-sm bg-card z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-bold font-headline text-foreground">SiraChat</h1>
            </div>
            <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
            </Button>
        </header>

        <ScrollArea className="flex-1">
            <div className="divide-y divide-border">
                {mockChats.map((chat) => (
                  <Link href="/chat" key={chat.id}>
                    <ChatListItem
                        avatar={chat.avatar}
                        name={chat.name}
                        lastMessage={chat.lastMessage}
                        time={chat.time}
                        unreadCount={chat.unread}
                        isMuted={chat.isMuted}
                        isTyping={chat.isTyping}
                        isArchived={chat.isArchived}
                        dataAiHint={chat.dataAiHint}
                    />
                  </Link>
                ))}
            </div>
        </ScrollArea>
        
        <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <Pencil className="h-6 w-6" />
        </Button>
    </div>
  );
}
