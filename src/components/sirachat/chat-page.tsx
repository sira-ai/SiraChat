"use client";

import { useState, useEffect } from "react";
import type { Message } from "@/types";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { MoreVertical, MessageSquare, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChatPageProps = {
  username: string;
  onLogout: () => void;
};

const initialMessages: Message[] = [
  { id: '1', text: 'Welcome to SiraChat! This is a demo chat.', sender: 'SiraBot', timestamp: new Date().toISOString() },
  { id: '2', text: 'Feel free to send messages. Replies are automated for demonstration.', sender: 'SiraBot', timestamp: new Date().toISOString() },
];


export default function ChatPage({ username, onLogout }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: username,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };
  
  useEffect(() => {
    if (messages.length > 2 && messages[messages.length - 1].sender === username) {
      const timeoutId = setTimeout(() => {
        const replyMessage: Message = {
          id: Date.now().toString(),
          text: "This is an automated reply!",
          sender: "SiraBot",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, replyMessage]);
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [messages, username]);


  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <MessageSquare className="h-5 w-5 text-primary"/>
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">SiraChat</h1>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Welcome, <span className="font-bold text-foreground">{username}</span></span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Change Name</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <MessageList messages={messages} currentUser={username} />
      </div>
      <footer className="border-t p-4 bg-card/50">
        <MessageInput onSendMessage={handleSendMessage} />
      </footer>
    </div>
  );
}
