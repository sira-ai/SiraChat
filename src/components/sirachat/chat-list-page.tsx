
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Search, Pencil, LogOut } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import type { UserProfile } from "@/types";
import { Skeleton } from "../ui/skeleton";

type ChatListPageProps = {
  currentUser: UserProfile;
  onLogout: () => void;
};

export default function ChatListPage({ currentUser, onLogout }: ChatListPageProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
                      <Link href={`/chat/${user.uid}`} key={user.uid}>
                        <ChatListItem
                            avatar={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.username.charAt(0).toUpperCase()}`}
                            name={user.username}
                            lastMessage={`Mulai percakapan dengan ${user.username}`}
                            time=""
                        />
                      </Link>
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
