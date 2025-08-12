"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import { collection, query, onSnapshot, where, getDocs, addDoc, serverTimestamp, doc, limit, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, Chat } from "@/types";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import UserProfileDialog from "./user-profile-dialog";
import { usePathname } from "next/navigation";

type ChatListContentProps = {
  currentUser: UserProfile;
  onChatSelect: (chatId: string) => void;
};

type ChatWithDetails = Chat & {
  partner: UserProfile;
  unreadCount: number;
}

function formatTimestamp(timestamp: any) {
    if (!timestamp) return '';
    try {
        const date = timestamp.toDate();
        return formatDistanceToNow(date, { addSuffix: true, locale: id });
    } catch(e) {
        return '';
    }
}

export default function ChatListContent({ currentUser, onChatSelect }: ChatListContentProps) {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const pathname = usePathname();


   useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsData: ChatWithDetails[] = [];
      let totalUnread = 0;
      
      const userPromises = [];

      for (const chatDoc of querySnapshot.docs) {
          const chat = { id: chatDoc.id, ...chatDoc.data() } as Chat;
          const partnerId = chat.members.find(uid => uid !== currentUser.uid);
          const unreadCount = chat.unreadCounts?.[currentUser.uid] || 0;
          totalUnread += unreadCount;

          if (partnerId) {
             const partnerProfile = chat.memberProfiles[partnerId];
              if (partnerProfile) {
                userPromises.push(getDoc(doc(db, 'users', partnerId)).then(userDoc => {
                     if (userDoc.exists()) {
                         chatsData.push({
                            ...chat,
                            unreadCount,
                            partner: userDoc.data() as UserProfile,
                        });
                     }
                 }));
              }
          }
      }

      await Promise.all(userPromises);
      
      if (totalUnread > 0) {
        document.title = `(${totalUnread}) SiraChat`;
      } else {
        document.title = 'SiraChat';
      }

      chatsData.sort((a, b) => {
        const timeA = a.lastMessageTimestamp?.toDate?.().getTime() || 0;
        const timeB = b.lastMessageTimestamp?.toDate?.().getTime() || 0;
        return timeB - timeA;
      });

      setChats(chatsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching chats: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleOpenNewChatDialog = async () => {
    setIsNewChatDialogOpen(true);
    setIsUsersLoading(true);
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "!=", currentUser.uid)
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile);
      });
      setUsers(usersData);
    } catch(e) {
      console.error("Failed to fetch users, might be offline or no permissions", e);
    } finally {
      setIsUsersLoading(false);
    }
  }

  const handleCreateOrOpenChat = async (partner: UserProfile) => {
    setIsNewChatDialogOpen(false);
    
    const sortedMembers = [currentUser.uid, partner.uid].sort();
    
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where('members', '==', sortedMembers), limit(1));
    
    try {
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        onChatSelect(existingChat.id)
      } else {
        const newChatRef = await addDoc(chatsRef, {
          members: sortedMembers,
          memberProfiles: {
            [currentUser.uid]: {
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
            },
            [partner.uid]: {
              username: partner.username,
              avatarUrl: partner.avatarUrl,
            }
          },
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageTimestamp: null,
          unreadCounts: { [currentUser.uid]: 0, [partner.uid]: 0 },
        });
        onChatSelect(newChatRef.id)
      }
    } catch(e) {
      console.error("Failed to create or open chat", e);
    }
  };


  return (
    <>
    <div className="flex h-full w-full flex-col bg-card">
        <header className="flex items-center justify-between p-3 border-b">
            <h1 className="text-xl font-bold font-headline text-foreground">Obrolan</h1>
            <div className="flex items-center gap-1">
                <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleOpenNewChatDialog}>
                            <Pencil className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Mulai Obrolan Baru</DialogTitle>
                        <DialogDescription>
                            Pilih pengguna di bawah ini untuk memulai percakapan.
                        </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                            {isUsersLoading ? (
                                <div className="p-3 space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div className="flex items-center gap-3" key={i}>
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <Skeleton className="h-5 w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {users.length > 0 ? users.map(user => (
                                        <div key={user.uid} onClick={() => handleCreateOrOpenChat(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                                            <Avatar className="h-11 w-11">
                                                <AvatarImage src={user.avatarUrl} alt={user.username}/>
                                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-semibold">{user.username}</p>
                                        </div>
                                    )) : <p className="text-sm text-center text-muted-foreground pt-4">Tidak ada pengguna lain yang ditemukan.</p>}
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsProfileDialogOpen(true)}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                        <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </div>
        </header>

        <ScrollArea className="flex-1">
             {isLoading ? (
                <div className="p-3 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div className="flex items-center gap-3" key={i}>
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {chats.length > 0 ? chats.map((chat) => (
                      <div key={chat.id} onClick={() => onChatSelect(chat.id)} className="cursor-pointer">
                        <ChatListItem
                            partner={chat.partner}
                            lastMessage={chat.lastMessage || `Mulai percakapan...`}
                            time={formatTimestamp(chat.lastMessageTimestamp)}
                            unreadCount={chat.unreadCount}
                            isActive={pathname === `/chat/${chat.id}`}
                        />
                      </div>
                    )) : (
                        <div className="text-center text-muted-foreground p-8">
                            <p>Anda belum memiliki obrolan.</p>
                            <p className="text-sm">Klik ikon pensil di atas untuk memulai!</p>
                        </div>
                    )}
                </div>
            )}
        </ScrollArea>
    </div>
    <UserProfileDialog
        user={currentUser}
        isMyProfile={true}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
    />
    </>
  );
}
