"use client";

import React, { useState, useEffect, useCallback } from "react";
import type { UserProfile } from "@/types";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import UserProfileDialog from "@/components/sirachat/user-profile-dialog";
import { doc, onSnapshot, updateDoc, serverTimestamp, writeBatch, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, deleteObject } from "firebase/storage";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

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

  const updateUserPresence = useCallback(async (user: UserProfile | null, status: 'online' | 'offline') => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        status: status,
        lastSeen: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to update user presence:", error);
    }
  }, []);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    let unsubscribe: (() => void) | null = null;
    let userData: UserProfile | null = null;

    if (storedUser) {
      userData = JSON.parse(storedUser);
      
      const userRef = doc(db, 'users', userData!.uid);
      unsubscribe = onSnapshot(userRef, (doc) => {
        if(doc.exists()) {
          const updatedUser = doc.data() as UserProfile;
          setCurrentUser(updatedUser);
          localStorage.setItem('sira-chat-user', JSON.stringify(updatedUser));
        } else {
            // User document has been deleted, log out
            console.log("User document not found. Logging out.");
            handleLogout(false);
        }
      }, (error) => {
        console.error("Failed to listen to user updates:", error);
        setCurrentUser(userData);
      });
      
      updateUserPresence(userData, 'online');

    } else {
      router.push('/');
    }
    setIsLoading(false);

    const handleBeforeUnload = () => {
        if (userData) {
            updateUserPresence(userData, 'offline');
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
        handleBeforeUnload(); // Set offline when component unmounts
        window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, updateUserPresence]);


  const handleLogout = (showToast = true) => {
    updateUserPresence(currentUser, 'offline');
    localStorage.removeItem('sira-chat-user');
    setCurrentUser(null);
    if(showToast) {
        toast({ title: "Anda telah keluar" });
    }
    router.push('/');
  }
  
  const handleDeleteAccount = async () => {
    if (!currentUser) return;

    try {
        await updateUserPresence(currentUser, 'offline');

        const batch = writeBatch(db);

        // 1. Find and delete all chats the user is a member of
        const chatsQuery = query(collection(db, "chats"), where("members", "array-contains", currentUser.uid));
        const chatsSnapshot = await getDocs(chatsQuery);

        for (const chatDoc of chatsSnapshot.docs) {
            // Delete messages subcollection
            const messagesQuery = query(collection(db, `chats/${chatDoc.id}/messages`));
            const messagesSnapshot = await getDocs(messagesQuery);
            messagesSnapshot.forEach(messageDoc => {
                batch.delete(messageDoc.ref);
            });
            // Delete the chat doc itself
            batch.delete(chatDoc.ref);
        }

        // 2. Delete user's avatar from Storage
        if (currentUser.avatarUrl && currentUser.avatarUrl.includes('firebasestorage')) {
            const avatarRef = ref(storage, `avatars/${currentUser.uid}/avatar.png`);
            try {
                await deleteObject(avatarRef);
            } catch (storageError: any) {
                if (storageError.code !== 'storage/object-not-found') {
                    throw storageError; // Re-throw if it's not a "not found" error
                }
            }
        }
        
        // 3. Delete the user document
        const userRef = doc(db, 'users', currentUser.uid);
        batch.delete(userRef);

        // Commit all batched writes
        await batch.commit();

        toast({ title: "Akun berhasil dihapus", description: "Kami harap dapat bertemu Anda lagi." });
        
        // Finally, log out
        handleLogout(false);

    } catch (error) {
        console.error("Error deleting account:", error);
        toast({ title: "Gagal Menghapus Akun", description: "Terjadi kesalahan yang tidak terduga.", variant: "destructive" });
    }
  };


  const handleChatSelect = (chatId: string) => {
    router.push(`/chat/${chatId}`);
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
          {children}
        </main>
      </div>
    </SidebarProvider>
    <UserProfileDialog
        user={currentUser}
        isMyProfile={true}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
    />
    </>
  );
}
