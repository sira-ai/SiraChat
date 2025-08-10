
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Pencil, LogOut, MessageSquarePlus } from "lucide-react";
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

type ChatListPageProps = {
  currentUser: UserProfile;
  onLogout: () => void;
};

type ChatWithPartner = Chat & {
  partner: UserProfile;
}

function formatTimestamp(timestamp: any) {
    if (!timestamp) return '';
    return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
}


export default function ChatListPage({ currentUser, onLogout }: ChatListPageProps) {
  const [chats, setChats] = useState<ChatWithPartner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const router = useRouter();

   useEffect(() => {
    // Query chats where the current user is a member
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid),
      orderBy("lastMessageTimestamp", "desc")
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
                        email: '' // Not needed for list item
                    }
                });
              }
          }
      }
      setChats(chatsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleOpenNewChatDialog = async () => {
    setIsNewChatDialogOpen(true);
    setIsUsersLoading(true);
     // Query all users except the current one
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
      setIsUsersLoading(false);
  }

  const handleCreateOrOpenChat = async (partner: UserProfile) => {
    setIsNewChatDialogOpen(false);
    const chatsRef = collection(db, "chats");
    // Query to find if a chat already exists between the two users
    const q = query(chatsRef, 
        where('members', '==', [currentUser.uid, partner.uid].sort())
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Chat exists, navigate to it
      const existingChat = querySnapshot.docs[0];
      router.push(`/chat/${existingChat.id}`);
    } else {
      // Chat doesn't exist, create it
      const newChatRef = await addDoc(chatsRef, {
        members: [currentUser.uid, partner.uid].sort(),
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
  };


  return (
    <div className="flex h-screen w-screen flex-col bg-background relative">
        <header className="flex items-center justify-between p-3 shadow-sm bg-card z-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-xl font-bold font-headline text-foreground">SiraChat</h1>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <Search className="h-6 w-6" />
                </Button>
                 <Button variant="ghost" size="icon" onClick={onLogout}>
                    <LogOut className="h-6 w-6" />
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
                      <div key={chat.id} onClick={() => router.push(`/chat/${chat.id}`)} className="cursor-pointer">
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
        
        <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
          <DialogTrigger asChild>
             <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon" onClick={handleOpenNewChatDialog}>
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
                            <div key={user.uid} onClick={() => handleCreateOrOpenChat(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-card/50 cursor-pointer transition-colors">
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

    </div>
  );
}
