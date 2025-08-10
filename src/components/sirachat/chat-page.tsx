
"use client";

import { useState, useEffect } from "react";
import type { Message, UserProfile, TypingStatus } from "@/types";
import { db, auth } from "@/lib/firebase"; // Import auth
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, updateDoc, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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

    return () => unsubscribeAuth();
  }, []);


  useEffect(() => {
    if (!currentUser || !chatId) {
        setIsLoading(isGlobal);
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
      setIsLoading(false);
    });

    // Listen for typing status changes
    let typingUnsubscribe = () => {};
    if (!isGlobal) {
        const typingRef = doc(db, "typingStatus", chatId);
        typingUnsubscribe = onSnapshot(typingRef, (doc) => {
            const data = doc.data() as TypingStatus | undefined;
            const currentTypingUsernames: string[] = [];

            if (data) {
                Object.entries(data).forEach(([uid, status]) => {
                    if (uid !== currentUser.uid && status.isTyping) {
                        currentTypingUsernames.push(status.username);
                    }
                });
            }
            setTypingUsers(currentTypingUsernames);
        });
    }

    // If this is a private chat, fetch the other user's profile
    if (!isGlobal && chatId) {
        const chatRef = doc(db, 'chats', chatId);
        const unsubscribeChat = onSnapshot(chatRef, async (chatSnap) => {
            if(chatSnap.exists()){
                const chatData = chatSnap.data();
                const partnerId = chatData.members.find((id: string) => id !== currentUser.uid);
                if(partnerId) {
                    const userRef = doc(db, 'users', partnerId);
                    const userSnap = await getDoc(userRef);
                    if(userSnap.exists()){
                        setChatPartner(userSnap.data() as UserProfile);
                    }
                }
            }
             setIsLoading(false);
        });
        return () => unsubscribeChat();
    }


    return () => {
      messagesUnsubscribe();
      typingUnsubscribe();
    }
  }, [currentUser, isGlobal, chatId]);

  const handleSendMessage = async (text: string, imageUrl?: string, stickerUrl?: string) => {
    if (!currentUser || !chatId) return;
    if (text.trim() === '' && !imageUrl && !stickerUrl) return;

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    const chatRef = doc(db, "chats", chatId);

    try {
      await addDoc(collection(db, messagesCollectionPath), {
        text: text,
        sender: currentUser.username, // Send username
        senderId: currentUser.uid, // Also send UID
        timestamp: serverTimestamp(),
        imageUrl: imageUrl || null,
        stickerUrl: stickerUrl || null,
      });

      // Update last message on the chat doc
       await updateDoc(chatRef, {
           lastMessage: text || (imageUrl ? "Gambar" : "Stiker"),
           lastMessageTimestamp: serverTimestamp()
       });

    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };
  
  const handleUserSelect = async (senderId: string) => {
    if(!senderId) return;
    const userRef = doc(db, 'users', senderId);
    const userSnap = await getDoc(userRef);
    if(userSnap.exists()){
        setSelectedUser(userSnap.data() as UserProfile);
    }
  }

  const getTypingIndicatorText = () => {
    if (!chatPartner) return "Online";
    if (typingUsers.length === 0) {
      return `Online`; // Default status for private chat
    }
    if (typingUsers.length === 1) {
      return `${typingUsers[0]} sedang mengetik...`;
    }
    if (typingUsers.length > 1) {
      return `${typingUsers.slice(0, 2).join(", ")} & lainnya sedang mengetik...`;
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
            <Avatar className="h-10 w-10">
              {isGlobal ? <Globe /> : <AvatarImage src={currentChatAvatar} alt={currentChatName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate">{currentChatName}</h1>
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
                <DropdownMenuItem onClick={() => handleUserSelect(chatPartner?.uid!)}>Info Kontak</DropdownMenuItem>
                <DropdownMenuItem>Blokir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        <MessageList messages={messages} currentUser={currentUser || null} onUserSelect={handleUserSelect} />
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput onSendMessage={handleSendMessage} currentUser={currentUser} chatId={chatId} />
      </footer>
    </div>
    <UserProfileDialog user={selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)} />
    </>
  );
}
