
"use client";

import { useState, useEffect } from "react";
import type { Message, UserProfile, TypingStatus, Chat } from "@/types";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, updateDoc, where, setDoc } from "firebase/firestore";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Globe } from "lucide-react";
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

// We can pass props to determine which chat we are in.
// For now, isGlobal will differentiate between the global chat and a private one.
type ChatPageProps = {
  isGlobal?: boolean;
  chatId?: string; // For private chats
};

export default function ChatPage({ isGlobal = false, chatId }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);


   useEffect(() => {
    // Get current user from localStorage
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);


  useEffect(() => {
    if (!currentUser || (!isGlobal && !chatId)) {
        setIsLoading(isGlobal); // only show global loading if it's the global page
        return;
    };

    // Determine the correct collection path for messages
    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    const messagesQuery = query(collection(db, messagesCollectionPath), orderBy("timestamp", "asc"));
    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          senderId: data.senderId,
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          imageUrl: data.imageUrl,
          stickerUrl: data.stickerUrl,
        });
      });
      setMessages(msgs);
      // We set loading to false here, after the first batch of messages is loaded
      if (isLoading) setIsLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
    });

    // Listen for typing status changes
    let typingUnsubscribe = () => {};
    if (!isGlobal && chatId && currentUser) {
        const typingRef = doc(db, "typingStatus", chatId);
        typingUnsubscribe = onSnapshot(typingRef, (doc) => {
            const data = doc.data() as TypingStatus | undefined;
            const currentTypingUsernames: string[] = [];

            if (data && chatPartner) {
                // We only care about the partner's typing status
                const partnerStatus = data[chatPartner.uid];
                if (partnerStatus?.isTyping) {
                   currentTypingUsernames.push(partnerStatus.username);
                }
            }
            setTypingUsers(currentTypingUsernames);
        });
    }

    // If this is a private chat, fetch the other user's profile
    let unsubscribeChat = () => {};
    if (!isGlobal && chatId && currentUser) {
        const chatRef = doc(db, 'chats', chatId);
        unsubscribeChat = onSnapshot(chatRef, async (chatSnap) => {
            if(chatSnap.exists()){
                const chatData = chatSnap.data() as Chat;
                const partnerId = chatData.members.find((id: string) => id !== currentUser.uid);
                if(partnerId) {
                    const partnerProfile = chatData.memberProfiles[partnerId];
                    if (partnerProfile) {
                        // Get full profile from users collection for email etc.
                        const userRef = doc(db, 'users', partnerId);
                        const userSnap = await getDoc(userRef);
                        if (userSnap.exists()){
                            setChatPartner(userSnap.data() as UserProfile);
                        }
                    } else {
                        // Fallback to fetching from users collection if not in chat doc
                        const userRef = doc(db, 'users', partnerId);
                        const userSnap = await getDoc(userRef);
                        if(userSnap.exists()){
                            setChatPartner(userSnap.data() as UserProfile);
                        }
                    }
                }
            }
             // We can set loading false here too, once we have chat info
             if (isLoading) setIsLoading(false);
        });
    }


    return () => {
      messagesUnsubscribe();
      typingUnsubscribe();
      unsubscribeChat();
    }
  }, [currentUser, isGlobal, chatId, isLoading, chatPartner]);

  const handleSendMessage = async (text: string, imageUrl?: string, stickerUrl?: string) => {
    if (!currentUser || (!isGlobal && !chatId)) return;
    if (text.trim() === '' && !imageUrl && !stickerUrl) return;

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    
    try {
      await addDoc(collection(db, messagesCollectionPath), {
        text: text || "",
        sender: currentUser.username, // Send username
        senderId: currentUser.uid, // Also send UID
        timestamp: serverTimestamp(),
        imageUrl: imageUrl || null,
        stickerUrl: stickerUrl || null,
      });

      // Update last message on the chat doc for private chats
      if (!isGlobal && chatId) {
          const chatRef = doc(db, "chats", chatId);
          let lastMessageText = "";
          if (text) {
              lastMessageText = text.length > 30 ? text.substring(0, 30) + "..." : text;
          } else if (imageUrl) {
              lastMessageText = "Gambar";
          } else if (stickerUrl) {
              lastMessageText = "Stiker";
          }
          
          await updateDoc(chatRef, {
              lastMessage: lastMessageText,
              lastMessageTimestamp: serverTimestamp()
          });
      }

    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const handleUserSelect = async (senderId: string) => {
    if(!senderId || !isGlobal && senderId === currentUser?.uid) {
        setSelectedUser(chatPartner);
        return;
    }
    const userRef = doc(db, 'users', senderId);
    const userSnap = await getDoc(userRef);
    if(userSnap.exists()){
        setSelectedUser(userSnap.data() as UserProfile);
    }
  }

  const getTypingIndicatorText = () => {
    if (typingUsers.length > 0) {
        return `${typingUsers[0]} sedang mengetik...`;
    }
    return "Online";
  }
  
  const currentChatName = isGlobal ? "Ruang Obrolan Global" : (chatPartner?.username || "Memuat Obrolan...");
  const currentChatAvatar = isGlobal ? undefined : (chatPartner?.avatarUrl || 'https://placehold.co/100x100.png');


  if (isLoading) {
    return (
        <div className="flex h-screen w-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
                 <div className="flex items-center gap-3">
                     <Button variant="ghost" size="icon" asChild>
                       <Link href="/">
                         <ArrowLeft className="h-6 w-6" />
                       </Link>
                     </Button>
                     <Skeleton className="h-10 w-10 rounded-full" />
                     <div className="min-w-0">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                     </div>
                 </div>
                 <Skeleton className="h-8 w-8" />
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
                <Skeleton className="h-16 w-3/4 rounded-lg" />
                <Skeleton className="h-20 w-3/4 ml-auto rounded-lg" />
                <Skeleton className="h-16 w-2/4 rounded-lg" />
            </div>
             <footer className="bg-transparent border-t-0 backdrop-blur-sm p-2">
                 <Skeleton className="h-12 w-full rounded-full" />
             </footer>
        </div>
    );
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
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>
              {isGlobal ? <Globe className="h-full w-full p-2"/> : <AvatarImage src={currentChatAvatar} alt={currentChatName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>{currentChatName}</h1>
              <p className="text-sm text-primary truncate">
                {isGlobal ? "Semua Pengguna" : getTypingIndicatorText()}
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
                <DropdownMenuItem onClick={() => handleUserSelect(chatPartner?.uid!)} disabled={isGlobal}>Info Kontak</DropdownMenuItem>
                <DropdownMenuItem disabled={isGlobal}>Blokir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        <MessageList messages={messages} currentUser={currentUser || null} onUserSelect={handleUserSelect} chatPartner={chatPartner}/>
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} chatId={chatId} />
      </footer>
    </div>
    <UserProfileDialog user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </>
  );
}
