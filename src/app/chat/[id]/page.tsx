
"use client";

import { useState, useEffect } from 'react';
import ChatPage from "@/components/sirachat/chat-page";
import type { UserProfile } from '@/types';
import { useParams } from 'next/navigation';

export default function PrivateChat() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const params = useParams();
  const chatId = params.id as string;

  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    if(storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  if (!currentUser) {
    return null; // Or a loading skeleton
  }

  return (
    <ChatPage
      chatId={chatId}
      currentUser={currentUser}
    />
  );
}
