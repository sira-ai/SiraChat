"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message, UserProfile, TypingStatus, Chat } from "@/types";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, updateDoc, writeBatch, getDocs } from "firebase/firestore";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { MoreVertical, User, PanelLeft, ArrowLeft, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "../ui/skeleton";
import UserProfileDialog from "./user-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type ChatPageProps = {
  chatId: string;
  currentUser: UserProfile | null;
};

export default function ChatPage({ chatId, currentUser }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [replyingToMessage, setReplyingToMessage] = useState<Message | null>(null);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { toast } = useToast();

  const handleUserSelect = useCallback(async (senderId: string) => {
    if (!currentUser) return;
    
    const isMyProfileSelected = !senderId || senderId === currentUser.uid;
    setIsMyProfile(isMyProfileSelected);

    const targetId = isMyProfileSelected ? currentUser.uid : senderId;

    if (!isMyProfileSelected && targetId === chatPartner?.uid) {
      setSelectedUser(chatPartner);
      return;
    }
    
    try {
      const userRef = doc(db, 'users', targetId);
      const userSnap = await getDoc(userRef);
      if(userSnap.exists()){
          setSelectedUser(userSnap.data() as UserProfile);
      }
    } catch (e) {
      console.error("Could not fetch user profile, possibly offline.", e);
    }
  }, [currentUser, chatPartner]);

  useEffect(() => {
    if (!currentUser || !chatId) {
        return;
    };

    setIsLoading(true); 

    const messagesCollectionPath = `chats/${chatId}/messages`;
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
          attachmentUrl: data.attachmentUrl,
          attachmentType: data.attachmentType,
          fileName: data.fileName,
          isEdited: data.isEdited,
          isDeleted: data.isDeleted,
          replyTo: data.replyTo,
        };
      });
      setMessages(msgs);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
    });

    const typingRef = doc(db, "typingStatus", chatId);
    const typingUnsubscribe = onSnapshot(typingRef, (doc) => {
        const data = doc.data() as TypingStatus | undefined;
        const currentTypingUsernames: string[] = [];
        
        if (data) {
            Object.keys(data).forEach(uid => {
                if (uid !== currentUser?.uid && data[uid].isTyping) {
                    currentTypingUsernames.push(data[uid].username);
                }
            });
        }
        setTypingUsers(currentTypingUsernames);
    });
    

    const chatRef = doc(db, 'chats', chatId);
    const unsubscribeChat = onSnapshot(chatRef, async (chatSnap) => {
        if(chatSnap.exists()){
            const chatData = chatSnap.data() as Chat;
            const partnerId = chatData.members.find((id: string) => id !== currentUser.uid);
            if(partnerId) {
                const partnerProfile = chatData.memberProfiles[partnerId];
                if (partnerProfile) {
                    setChatPartner({
                        uid: partnerId,
                        username: partnerProfile.username,
                        avatarUrl: partnerProfile.avatarUrl,
                        email: ''
                    });
                } else {
                    const userRef = doc(db, 'users', partnerId);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()){
                        setChatPartner(userSnap.data() as UserProfile);
                    }
                }
            }
        } else {
             console.log("Chat does not exist, redirecting.");
             toast({ title: "Obrolan tidak ditemukan", description: "Obrolan ini mungkin telah dihapus.", variant: "destructive"});
             router.push('/chat');
        }
         setIsLoading(false);
    });

    return () => {
      messagesUnsubscribe();
      typingUnsubscribe();
      unsubscribeChat();
    }
  }, [currentUser, chatId, router, toast]);

  const handleSendMessage = async (message: string, attachmentUrl?: string, attachmentType?: 'image' | 'file', fileName?: string) => {
    if (!currentUser || !chatId) return;
    if (message.trim() === '' && !attachmentUrl) return;

    if (editingMessage) {
        await handleEditMessage(editingMessage.id, message);
        return;
    }

    const messagesCollectionPath = `chats/${chatId}/messages`;
    
    try {
      let replyToObject = null;
      if (replyingToMessage) {
        replyToObject = {
            messageId: replyingToMessage.id,
            sender: replyingToMessage.sender,
            text: replyingToMessage.text,
            attachmentType: replyingToMessage.attachmentType,
        };
      }

      await addDoc(collection(db, messagesCollectionPath), {
        text: message || "",
        sender: currentUser.username,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        attachmentUrl: attachmentUrl || null,
        attachmentType: attachmentType || null,
        fileName: fileName || null,
        replyTo: replyToObject,
      });

      setReplyingToMessage(null); // Reset reply state

      const chatRef = doc(db, "chats", chatId);
      let lastMessageText;
      if (message) {
          lastMessageText = message.length > 30 ? message.substring(0, 30) + "..." : message;
      } else if (attachmentType === 'image') {
          lastMessageText = "Gambar";
      } else if (attachmentType === 'file') {
          lastMessageText = "Dokumen";
      } else {
          lastMessageText = "Lampiran";
      }
      
      await updateDoc(chatRef, {
          lastMessage: lastMessageText,
          lastMessageTimestamp: serverTimestamp()
      });
      
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!chatId) return;
    const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
    try {
        await updateDoc(messageRef, {
            text: newText,
            isEdited: true,
        });
        setEditingMessage(null);
        toast({ title: "Pesan berhasil diedit" });
    } catch (error) {
        console.error("Error editing message:", error);
        toast({ title: "Gagal mengedit pesan", variant: "destructive" });
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!chatId) return;
    const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
    try {
        await updateDoc(messageRef, {
            text: "Pesan ini telah dihapus.",
            attachmentUrl: null,
            attachmentType: null,
            fileName: null,
            isDeleted: true,
            replyTo: null,
        });
        toast({ title: "Pesan berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting message:", error);
        toast({ title: "Gagal menghapus pesan", variant: "destructive" });
    }
  }

  const handleReplyMessage = (message: Message) => {
    setEditingMessage(null); // Cancel any ongoing edit
    setReplyingToMessage(message);
  }

  const handleDeleteChat = async () => {
    if (!chatId || !currentUser) return;

    try {
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        const messagesSnap = await getDocs(messagesRef);
        
        const batch = writeBatch(db);
        messagesSnap.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        const chatRef = doc(db, 'chats', chatId);
        batch.delete(chatRef);

        await batch.commit();

        toast({ title: "Obrolan berhasil dihapus" });
        router.push('/chat');

    } catch (error) {
        console.error("Error deleting chat:", error);
        toast({ title: "Gagal menghapus obrolan", description: "Terjadi kesalahan yang tidak terduga.", variant: "destructive" });
    }
  }

  const getTypingIndicatorText = () => {
    if (typingUsers.length > 0) {
        const users = typingUsers.slice(0, 2).join(', ');
        return `${users} sedang mengetik...`;
    }
    return chatPartner ? "Online" : "";
  }
  
  const currentChatName = chatPartner?.username || "Memuat Obrolan...";
  const currentChatAvatar = chatPartner?.avatarUrl || 'https://placehold.co/100x100.png';


  if (isLoading || !currentUser || !chatPartner) {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card h-[69px]">
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
             <footer className="bg-transparent border-t p-2">
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
            {isMobile && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/chat">
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Kembali ke daftar obrolan</span>
                </Link>
              </Button>
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Buka Sidebar</span>
              </Button>
            )}
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>
              <AvatarImage src={currentChatAvatar} alt={currentChatName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>{currentChatName}</h1>
              <p className="text-sm text-primary truncate">
                {getTypingIndicatorText()}
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-6 w-6" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUserSelect(chatPartner?.uid!)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Info Kontak</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4"/>
                            <span>Hapus Obrolan</span>
                        </DropdownMenuItem>
                     </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus seluruh riwayat percakapan ini secara permanen.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive hover:bg-destructive/90">
                        Ya, Hapus
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        <MessageList 
            messages={messages} 
            currentUser={currentUser} 
            onUserSelect={handleUserSelect} 
            chatPartner={chatPartner}
            onEditMessage={(message) => { setReplyingToMessage(null); setEditingMessage(message); }}
            onDeleteMessage={handleDeleteMessage}
            onReplyMessage={handleReplyMessage}
        />
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput 
            onSendMessage={handleSendMessage} 
            currentUser={currentUser} 
            chatId={chatId} 
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            replyingToMessage={replyingToMessage}
            onCancelReply={() => setReplyingToMessage(null)}
        />
      </footer>
    </div>
    <UserProfileDialog 
        user={selectedUser} 
        isMyProfile={isMyProfile}
        onOpenChange={(open) => !open && setSelectedUser(null)} 
    />
    </>
  );
}
