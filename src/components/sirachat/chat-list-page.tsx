
"use client";

import React, { useState } from "react";
import type { UserProfile } from "@/types";
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut, MessageSquare, Settings, User as UserIcon } from "lucide-react";
import ChatPage from "./chat-page";
import ChatListContent from "./chat-list-content";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "@/components/ui/button";

type ChatLayoutProps = {
  currentUser: UserProfile;
  onLogout: () => void;
};

export default function ChatListPage({ currentUser, onLogout }: ChatLayoutProps) {
  const [selectedChatId, setSelectedChatId] = useState<string | null>('global'); // Default to global chat
  const router = useRouter();

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if(chatId !== 'global') {
        router.push(`/chat/${chatId}`, { scroll: false });
    } else {
        router.push(`/chat`, { scroll: false });
    }
  };

  const handleLogoutClick = () => {
      onLogout();
      router.push('/');
  }

  return (
    <SidebarProvider>
        <div className="flex h-screen w-screen bg-background">
            <Sidebar collapsible="icon" className="w-[320px]">
                <SidebarHeader>
                    {/* Header can be a logo or app name */}
                </SidebarHeader>
                <SidebarContent>
                    <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
                </SidebarContent>
                <SidebarFooter>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-card/50 transition-colors">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                            <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold truncate">{currentUser.username}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogoutClick}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </SidebarFooter>
            </Sidebar>

            <main className="flex-1 h-screen">
                 {selectedChatId ? (
                    <ChatPage
                        key={selectedChatId} // Re-mounts component on chat change
                        isGlobal={selectedChatId === 'global'}
                        chatId={selectedChatId !== 'global' ? selectedChatId : undefined}
                    />
                ) : (
                    <div className="flex h-full flex-col items-center justify-center bg-background text-muted-foreground">
                        <MessageSquare className="h-24 w-24 mb-4" />
                        <h2 className="text-2xl font-semibold">Selamat Datang di SiraChat</h2>
                        <p>Pilih obrolan dari daftar untuk memulai.</p>
                    </div>
                )}
            </main>
        </div>
    </SidebarProvider>
  );
}
