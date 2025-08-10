
"use client";

import React, { useState, useEffect } from "react";
import type { UserProfile } from "@/types";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
        router.push('/');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('sira-chat-user');
    setCurrentUser(null);
    router.push('/');
  }

  const handleChatSelect = (chatId: string) => {
    router.push(chatId === 'global' ? '/chat/global' : `/chat/${chatId}`);
  };

  if (isLoading || !currentUser) {
    return (
        <div className="flex h-screen w-screen bg-background">
            <div className="hidden md:flex flex-col w-full max-w-xs border-r p-2 gap-2">
                <Skeleton className="h-[65px] w-full" />
                <Skeleton className="h-full w-full" />
                <Skeleton className="h-[56px] w-full" />
            </div>
            <div className="flex-1 h-screen flex flex-col">
                 <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card h-[69px]">
                     <div className="flex items-center gap-3">
                         <Skeleton className="h-10 w-10 rounded-full" />
                         <div className="min-w-0">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-20" />
                         </div>
                     </div>
                     <Skeleton className="h-8 w-8" />
                </header>
                <div className="flex-1" />
                 <footer className="bg-transparent border-t p-2">
                     <Skeleton className="h-12 w-full rounded-full" />
                 </footer>
            </div>
        </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        {!isMobile && (
          <Sidebar className="w-full max-w-xs border-r">
              <SidebarContent className="p-0">
                  <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
              </SidebarContent>
              <SidebarFooter className="p-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors">
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                          <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                          <p className="font-bold truncate">{currentUser.username}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleLogout}>
                          <LogOut className="h-5 w-5" />
                      </Button>
                  </div>
              </SidebarFooter>
          </Sidebar>
        )}

        <main className="flex-1 h-screen">
            {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
