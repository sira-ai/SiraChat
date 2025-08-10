
"use client";

import ChatListPage from "@/components/sirachat/chat-list-page";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatsRootPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const router = useRouter();
    const isMobile = useIsMobile();

    useEffect(() => {
        const storedUser = localStorage.getItem('sira-chat-user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else {
            router.push('/');
        }
    }, [router]);

    const handleChatSelect = (chatId: string) => {
        router.push(chatId === 'global' ? '/chat' : `/chat/${chatId}`);
    };

    if (isMobile) {
        if (!currentUser) return null; // or a loading state
        return <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect} />;
    }

    return <ChatListPage />;
}
