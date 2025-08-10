
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Pencil, LogOut } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, where, getDocs, addDoc, or, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile } from "@/types";
import { Skeleton } from "../ui/skeleton";

type ChatListPageProps = {
  currentUser: UserProfile;
  onLogout: () => void;
};

export default function ChatListPage({ currentUser, onLogout }: ChatListPageProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Query all users except the current one
    const usersQuery = query(
      collection(db, "users"),
      where("uid", "!=", currentUser.uid)
    );

    const unsubscribe = onSnapshot(usersQuery, (querySnapshot) => {
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile);
      });
      setUsers(usersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleCreateOrOpenChat = async (partner: UserProfile) => {
    const chatsRef = collection(db, "chats");
    // Query to find if a chat already exists between the two users
    const q = query(chatsRef, 
        where('members', 'array-contains', currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    let existingChatId: string | null = null;

    querySnapshot.forEach(doc => {
        const chatData = doc.data();
        if (chatData.members.includes(partner.uid)) {
            existingChatId = doc.id;
        }
    });


    if (existingChatId) {
      // Chat exists, navigate to it
      router.push(`/chat/${existingChatId}`);
    } else {
      // Chat doesn't exist, create it
      const newChatRef = await addDoc(chatsRef, {
        members: [currentUser.uid, partner.uid],
        createdAt: new Date(),
        lastMessage: null,
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
                    {users.map((user) => (
                      <div key={user.uid} onClick={() => handleCreateOrOpenChat(user)} className="cursor-pointer">
                        <ChatListItem
                            avatar={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.username.charAt(0).toUpperCase()}`}
                            name={user.username}
                            lastMessage={`Mulai percakapan dengan ${user.username}`}
                            time=""
                        />
                      </div>
                    ))}
                </div>
            )}
        </ScrollArea>
        
        <Button className="absolute bottom-6 right-6 h-14 w-14 rounded-full shadow-lg" size="icon">
          <Pencil className="h-6 w-6" />
        </Button>
    </div>
  );
}
