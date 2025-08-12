"use client";

import ChatListPage from "@/components/sirachat/chat-list-page";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatsRootPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const router = useRouter();
    const isMobile = useIsMobile();
    const [hasCheckedChats, setHasCheckedChats] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('sira-chat-user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setCurrentUser(user);

            // For desktop, redirect to the most recent chat.
            if (!isMobile) {
                const chatsQuery = query(
                  collection(db, "chats"),
                  where("members", "array-contains", user.uid),
                  orderBy("lastMessageTimestamp", "desc"),
                  limit(1)
                );
                
                getDocs(chatsQuery).then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        const mostRecentChat = querySnapshot.docs[0];
                        if (mostRecentChat) {
                           router.replace(`/chat/${mostRecentChat.id}`);
                        }
                    } else {
                        // No chats found, stay on the welcome page
                        setHasCheckedChats(true);
                    }
                }).catch(() => {
                    // Error fetching, stay on welcome page
                    setHasCheckedChats(true);
                });
            } else {
                setHasCheckedChats(true); // On mobile, we show the list, so it's "checked"
            }

        } else {
            router.push('/');
        }
    }, [router, isMobile]);

    const handleChatSelect = (chatId: string) => {
        router.push(`/chat/${chatId}`);
    };

    if (isMobile) {
        if (!currentUser) return null; // or a loading state
        return <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect} />;
    }
    
    // For desktop, show a welcome/instruction page if no chat is selected yet
    if (hasCheckedChats) {
        return <ChatListPage />;
    }
    
    // While checking for chats on desktop, show a loading or skeleton state
    return null;
}
