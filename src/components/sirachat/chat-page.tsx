
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message, UserProfile, TypingStatus, Chat } from "@/types";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, updateDoc, where, setDoc } from "firebase/firestore";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Globe, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import UserProfileDialog from "./user-profile-dialog";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ChatPageProps = {
  isGlobal?: boolean;
  chatId?: string;
};

export default function ChatPage({ isGlobal = false, chatId }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const router = useRouter();


   useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      router.push('/'); // Redirect if no user
    }
  }, [router]);


  useEffect(() => {
    if (!currentUser || (!isGlobal && !chatId)) {
        setIsLoading(isGlobal); 
        return;
    };

    setIsLoading(true); // Set loading to true at the beginning of effect

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    const messagesQuery = query(collection(db, messagesCollectionPath), orderBy("timestamp", "asc"));
    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs: Message[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          senderId: data.senderId,
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          imageUrl: data.imageUrl,
          stickerUrl: data.stickerUrl,
        };
      });
      setMessages(msgs);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
    });

    let typingUnsubscribe = () => {};
    if (!isGlobal && chatId && currentUser) {
        const typingRef = doc(db, "typingStatus", chatId);
        typingUnsubscribe = onSnapshot(typingRef, (doc) => {
            const data = doc.data() as TypingStatus | undefined;
            const currentTypingUsernames: string[] = [];

            if (data && chatPartner) {
                const partnerStatus = data[chatPartner.uid];
                if (partnerStatus?.isTyping) {
                   currentTypingUsernames.push(partnerStatus.username);
                }
            }
            setTypingUsers(currentTypingUsernames);
        });
    }

    let unsubscribeChat = () => {};
    if (!isGlobal && chatId && currentUser) {
        const chatRef = doc(db, 'chats', chatId);
        unsubscribeChat = onSnapshot(chatRef, async (chatSnap) => {
            if(chatSnap.exists()){
                const chatData = chatSnap.data() as Chat;
                const partnerId = chatData.members.find((id: string) => id !== currentUser.uid);
                if(partnerId) {
                    const userRef = doc(db, 'users', partnerId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()){
                        setChatPartner(userSnap.data() as UserProfile);
                    }
                }
            }
             setIsLoading(false);
        });
    } else {
        setIsLoading(false); // Not a private chat, so stop loading
    }


    return () => {
      messagesUnsubscribe();
      typingUnsubscribe();
      unsubscribeChat();
    }
  }, [currentUser, isGlobal, chatId, chatPartner, router]);

  const handleSendMessage = async (text: string, imageUrl?: string, stickerUrl?: string) => {
    if (!currentUser || (!isGlobal && !chatId)) return;
    if (text.trim() === '' && !imageUrl && !stickerUrl) return;

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    
    try {
      await addDoc(collection(db, messagesCollectionPath), {
        text: text || "",
        sender: currentUser.username,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        imageUrl: imageUrl || null,
        stickerUrl: stickerUrl || null,
      });

      if (!isGlobal && chatId) {
          const chatRef = doc(db, "chats", chatId);
          let lastMessageText = text ? (text.length > 30 ? text.substring(0, 30) + "..." : text) 
                                : imageUrl ? "Gambar" 
                                : "Stiker";
          
          await updateDoc(chatRef, {
              lastMessage: lastMessageText,
              lastMessageTimestamp: serverTimestamp()
          });
      }

    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const handleUserSelect = useCallback(async (senderId: string) => {
    if(!senderId || !isGlobal && senderId === currentUser?.uid) {
        setSelectedUser(chatPartner);
        return;
    }
    try {
      const userRef = doc(db, 'users', senderId);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()){
          setSelectedUser(userSnap.data() as UserProfile);
      }
    } catch (e) {
      console.error("Could not fetch user profile, possibly offline.", e);
    }
  }, [isGlobal, currentUser, chatPartner]);

  const getTypingIndicatorText = () => {
    if (typingUsers.length > 0) {
        return `${typingUsers[0]} sedang mengetik...`;
    }
    return chatPartner ? "Online" : "";
  }
  
  const currentChatName = isGlobal ? "Ruang Obrolan Global" : (chatPartner?.username || "Memuat Obrolan...");
  const currentChatAvatar = isGlobal ? undefined : (chatPartner?.avatarUrl || 'https://placehold.co/100x100.png');


  if (isLoading || !currentUser) {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
                 <div className="flex items-center gap-3">
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
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>
              {isGlobal ? <Globe className="h-full w-full p-2"/> : <AvatarImage src={currentChatAvatar} alt={currentChatName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>{currentChatName}</h1>
              <p className="text-sm text-primary truncate">
                {isGlobal ? "Semua Pengguna Online" : getTypingIndicatorText()}
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
                <DropdownMenuItem onClick={() => handleUserSelect(chatPartner?.uid!)} disabled={isGlobal}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Info Kontak</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        <MessageList messages={messages} currentUser={currentUser} onUserSelect={handleUserSelect} chatPartner={chatPartner}/>
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} chatId={chatId} isGlobal={isGlobal} />
      </footer>
    </div>
    <UserProfileDialog user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </>
  );
}
