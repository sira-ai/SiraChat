
"use client";

import { useState, useEffect } from "react";
import ChatPage from "@/components/sirachat/chat-page";
import type { UserProfile } from "@/types";

export default function GlobalChatPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('sira-chat-user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    if (!currentUser) {
        return null; // Or a loading skeleton
    }
    
    return <ChatPage isGlobal={true} currentUser={currentUser} />;
}
