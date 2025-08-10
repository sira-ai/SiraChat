
"use client";

import { useState, useEffect } from "react";
import type { Message, UserProfile, TypingStatus } from "@/types";
import { db, auth } from "@/lib/firebase"; // Import auth
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

   useEffect(() => {
    // Listen for auth state changes to get the current user
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUser(userSnap.data() as UserProfile);
        } else {
            // Fallback if user profile doesn't exist for some reason
            const username = firebaseUser.email?.split('@')[0] || 'user';
            const newUserProfile: UserProfile = {
                uid: firebaseUser.uid,
                username: username,
                email: firebaseUser.email!
            }
            await setDoc(userRef, newUserProfile);
            setCurrentUser(newUserProfile);
        }
      } else {
        setCurrentUser(null);
      }
    });

    const messagesQuery = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
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

    // Listen for typing status changes
    const typingQuery = query(collection(db, "typingStatus"));
    const typingUnsubscribe = onSnapshot(typingQuery, (querySnapshot) => {
        const currentTypingUsers: string[] = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as TypingStatus;
            // Only add if user is typing and is not the current user
            if (data.isTyping && doc.id !== currentUser?.username) {
                currentTypingUsers.push(doc.id);
            }
        });
        setTypingUsers(currentTypingUsers);
    });

    return () => {
      unsubscribeAuth();
      messagesUnsubscribe();
      typingUnsubscribe();
    }
  }, [currentUser?.username]);

  const handleSendMessage = async (text: string, imageUrl?: string, stickerUrl?: string) => {
    if (!currentUser) return;
    if (text.trim() === '' && !imageUrl && !stickerUrl) return;
    try {
      await addDoc(collection(db, "messages"), {
        text: text,
        sender: currentUser.username, // Send username
        senderId: currentUser.uid, // Also send UID
        timestamp: serverTimestamp(),
        imageUrl: imageUrl || null,
        stickerUrl: stickerUrl || null,
      });
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const handleUserSelect = async (senderId: string) => {
    const userRef = doc(db, 'users', senderId);
    const userSnap = await getDoc(userRef);
    if(userSnap.exists()){
        setSelectedUser(userSnap.data() as UserProfile);
    }
  }

  const getTypingIndicatorText = () => {
    if (typingUsers.length === 0) {
      return `${currentChat.members} anggota`;
    }
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} sedang mengetik...`;
    }
    if (typingUsers.length > 1) {
      return `${typingUsers.slice(0, 2).join(", ")} & lainnya sedang mengetik...`;
    }
  }

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
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate">{currentChat.name}</h1>
              <p className="text-sm text-primary truncate">
                {typingUsers.length > 0 ? getTypingIndicatorText() : `${currentChat.members} anggota`}
              </p>
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
          <MessageList messages={messages} currentUser={currentUser || null} onUserSelect={handleUserSelect} />
        )}
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} />
      </footer>
    </div>
    <UserProfileDialog user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </>
  );
}
