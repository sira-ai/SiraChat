
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, MessageSquarePlus, Globe } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, where, getDocs, addDoc, serverTimestamp, doc, orderBy, limit } from "firebase/firestore";
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
import Link from "next/link";
import { Separator } from "../ui/separator";

type ChatListContentProps = {
  currentUser: UserProfile;
  onChatSelect: (chatId: string) => void;
};

type ChatWithPartner = Chat & {
  partner: UserProfile;
}

function formatTimestamp(timestamp: any) {
    if (!timestamp) return '';
    if (timestamp && typeof timestamp.toDate === 'function') {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
    }
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id });
}


export default function ChatListContent({ currentUser, onChatSelect }: ChatListContentProps) {
  const [chats, setChats] = useState<ChatWithPartner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const router = useRouter();

   useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsData: ChatWithPartner[] = [];
      
      for (const chatDoc of querySnapshot.docs) {
          const chat = chatDoc.data() as Chat;
          const partnerId = chat.members.find(uid => uid !== currentUser.uid);

          if (partnerId) {
             const partnerProfile = chat.memberProfiles[partnerId];
              if (partnerProfile) {
                 chatsData.push({
                    ...chat,
                    id: chatDoc.id,
                    partner: {
                        uid: partnerId,
                        username: partnerProfile.username,
                        avatarUrl: partnerProfile.avatarUrl,
                        email: ''
                    }
                });
              }
          }
      }

      chatsData.sort((a, b) => {
        const timeA = a.lastMessageTimestamp?.toDate()?.getTime() || 0;
        const timeB = b.lastMessageTimestamp?.toDate()?.getTime() || 0;
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
    const predictableChatId = sortedMembers.join('_');
    
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where('members', '==', sortedMembers), limit(1));
    
    try {
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        router.push(`/chat/${existingChat.id}`);
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
        });
        router.push(`/chat/${newChatRef.id}`);
      }
    } catch(e) {
      console.error("Failed to create or open chat", e);
    }
  };


  return (
    <div className="flex h-screen w-full flex-col bg-card relative border-r">
        <header className="flex items-center justify-between p-3 shadow-sm z-10">
            <h1 className="text-xl font-bold font-headline text-foreground">Obrolan</h1>
            <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleOpenNewChatDialog}>
                        <Pencil className="h-6 w-6" />
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
                                {users.map(user => (
                                    <div key={user.uid} onClick={() => handleCreateOrOpenChat(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-background/50 cursor-pointer transition-colors">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatarUrl} alt={user.username}/>
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <p className="font-semibold">{user.username}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
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
                    <Link href="/chat" className="cursor-pointer" onClick={() => onChatSelect('global')}>
                      <div className="flex items-center gap-3 p-3 hover:bg-background/50 transition-colors">
                        <Avatar className="h-14 w-14 flex-shrink-0 bg-primary/20 text-primary">
                          <div className="w-full h-full flex items-center justify-center">
                            <Globe className="h-8 w-8" />
                          </div>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-bold truncate text-foreground">Ruang Obrolan Global</h2>
                          <p className="text-sm truncate text-muted-foreground">Ngobrol dengan semua pengguna SiraChat</p>
                        </div>
                      </div>
                    </Link>
                    <Separator />
                    {chats.length > 0 ? chats.map((chat) => (
                      <div key={chat.id} onClick={() => onChatSelect(chat.id)} className="cursor-pointer">
                        <ChatListItem
                            avatar={chat.partner.avatarUrl || `https://placehold.co/100x100.png`}
                            name={chat.partner.username}
                            lastMessage={chat.lastMessage || `Mulai percakapan...`}
                            time={formatTimestamp(chat.lastMessageTimestamp)}
                        />
                      </div>
                    )) : (
                       <div className="flex flex-col items-center justify-center h-full text-center p-8 mt-16">
                            <MessageSquarePlus className="h-20 w-20 text-muted-foreground/50 mb-4" />
                            <h2 className="text-xl font-semibold">Belum Ada Obrolan</h2>
                            <p className="text-muted-foreground">Klik tombol pensil untuk memulai percakapan baru.</p>
                        </div>
                    )}
                </div>
            )}
        </ScrollArea>
    </div>
  );
}
