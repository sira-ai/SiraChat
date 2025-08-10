
"use client";

import { useState, useEffect } from "react";
import type { Message, UserProfile } from "@/types";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, MessageSquare, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import UserProfileDialog from "./user-profile-dialog";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// This is now a generic chat page, not tied to the main user
export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

   useEffect(() => {
    // In a real app, you'd get the current user from auth context
    const storedUsername = localStorage.getItem('sirachat_username');
    if (storedUsername) {
      setCurrentUser(storedUsername);
    }

    // In a real app, you'd fetch messages for a specific chat ID
    const q = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          imageUrl: data.imageUrl,
          stickerUrl: data.stickerUrl,
        });
      });
      setMessages(msgs);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSendMessage = async (text: string, imageUrl?: string, stickerUrl?: string) => {
    if (!currentUser) return;
    if (text.trim() === '' && !imageUrl && !stickerUrl) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: text,
        sender: currentUser,
        timestamp: serverTimestamp(),
        imageUrl: imageUrl || null,
        stickerUrl: stickerUrl || null,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const handleUserSelect = (sender: string) => {
    // In a group chat, you might fetch profile info from a 'users' collection
    setSelectedUser({ username: sender, avatarUrl: `https://placehold.co/100x100.png` });
  }

  // Placeholder for the chat you are in. In a real app this would be dynamic.
  const currentChat = {
    name: "YAPPING ||",
    members: 10,
    avatar: 'https://placehold.co/100x100.png'
  }

  return (
    <>
    <div className="flex h-screen w-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
        <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-6 w-6" />
              </Link>
            </Button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentChat.avatar} alt={currentChat.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight">{currentChat.name}</h1>
              <p className="text-sm text-muted-foreground">{currentChat.members} anggota</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-6 w-6" />
                  <span className="sr-only">Buka menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Menu items can go here later, e.g. "Lihat Info Grup", "Bisukan", etc. */}
                <DropdownMenuItem>Info Grup</DropdownMenuItem>
                <DropdownMenuItem>Keluar Grup</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        {isLoading ? (
          <div className="p-4 space-y-4">
            <Skeleton className="h-16 w-3/4 rounded-lg" />
            <Skeleton className="h-20 w-3/4 ml-auto rounded-lg" />
            <Skeleton className="h-16 w-2/4 rounded-lg" />
          </div>
        ) : (
          <MessageList messages={messages} currentUser={currentUser || ''} onUserSelect={handleUserSelect} />
        )}
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>
    </div>
    <UserProfileDialog user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </>
  );
}

    