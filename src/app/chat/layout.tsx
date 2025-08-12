"use client";

import React, { useState, useEffect } from "react";
import type { UserProfile } from "@/types";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import UserProfileDialog from "@/components/sirachat/user-profile-dialog";
import { doc, onSnapshot, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { ref, deleteObject } from "firebase/storage";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Dialog state
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    let unsubscribe: (() => void) | null = null;

    if (storedUser) {
      const userData: UserProfile = JSON.parse(storedUser);
      
      const userRef = doc(db, 'users', userData.uid);
      unsubscribe = onSnapshot(userRef, (doc) => {
        if(doc.exists()) {
          const updatedUser = doc.data() as UserProfile;
          setCurrentUser(updatedUser);
          localStorage.setItem('sira-chat-user', JSON.stringify(updatedUser));
        } else {
          // If user doc is deleted (e.g. by another client), log out
          handleLogout(false);
        }
      }, (error) => {
        console.error("Failed to listen to user updates:", error);
        setCurrentUser(userData);
      });

    } else {
      router.push('/');
    }
    setIsLoading(false);

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);


  const handleLogout = (showToast = true) => {
    localStorage.removeItem('sira-chat-user');
    setCurrentUser(null);
    if(showToast) {
        toast({ title: "Anda telah keluar." });
    }
    router.push('/');
  }

  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    try {
        const batch = writeBatch(db);

        // 1. Find and delete all chats the user is a member of
        const chatsQuery = query(collection(db, "chats"), where("members", "array-contains", currentUser.uid));
        const chatsSnapshot = await getDocs(chatsQuery);

        for (const chatDoc of chatsSnapshot.docs) {
            const messagesQuery = query(collection(db, `chats/${chatDoc.id}/messages`));
            const messagesSnapshot = await getDocs(messagesQuery);
            messagesSnapshot.forEach(messageDoc => {
                batch.delete(messageDoc.ref);
            });
            batch.delete(chatDoc.ref);
        }

        // 2. Delete user's avatar from Storage if it exists
        if (currentUser.avatarUrl && currentUser.avatarUrl.includes('firebasestorage')) {
             try {
                const avatarRef = ref(storage, currentUser.avatarUrl);
                await deleteObject(avatarRef);
            } catch (storageError: any) {
                // If the object doesn't exist, we can ignore the error.
                if (storageError.code !== 'storage/object-not-found') {
                    console.error("Could not delete avatar:", storageError);
                }
            }
        }
        
        // 3. Delete the user document
        const userRef = doc(db, 'users', currentUser.uid);
        batch.delete(userRef);

        await batch.commit();

        toast({ title: "Akun berhasil dihapus", description: "Kami harap dapat bertemu Anda lagi." });
        
        handleLogout(false);

    } catch (error) {
        console.error("Error deleting account:", error);
        toast({ title: "Gagal Menghapus Akun", description: "Terjadi kesalahan yang tidak terduga.", variant: "destructive" });
    }
  };


  const handleChatSelect = (chatId: string) => {
    router.push(chatId === 'global' ? '/chat/global' : `/chat/${chatId}`);
  };

  const openMyProfile = () => {
    setIsProfileDialogOpen(true);
  }

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
    <>
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <Sidebar className="w-full max-w-xs border-r hidden md:flex">
            <SidebarContent className="p-0">
                <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors cursor-pointer" onClick={openMyProfile}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                        <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{currentUser.username}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>

        <main className="flex-1 h-screen">
          {isMobile ? children : (
            <div className="h-full w-full flex">
              <div className="w-full max-w-xs border-r xl:flex flex-col bg-background hidden">
                 <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
              </div>
              <div className="flex-1 h-screen">
                {children}
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
    <UserProfileDialog
        user={currentUser}
        isMyProfile={true}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        onLogout={() => { setIsProfileDialogOpen(false); handleLogout(); }}
        onDeleteAccount={() => { setIsProfileDialogOpen(false); handleDeleteAccount(); }}
    />
    </>
  );
}
