
"use client";

import { useState } from 'react';
import UsernameSetup from '@/components/sirachat/username-setup';
import ChatListPage from '@/components/sirachat/chat-list-page'; // Changed component
import { Skeleton } from '@/components/ui/skeleton';
import useClientEffect from '@/hooks/use-client-effect'; // Custom hook for client-side only logic

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Custom hook to run localStorage logic only on the client
  useClientEffect(() => {
    const storedUsername = localStorage.getItem('sirachat_username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsLoading(false);
  }, []);

  const handleUsernameSet = (newUsername: string) => {
    try {
      localStorage.setItem('sirachat_username', newUsername);
      setUsername(newUsername);
    } catch (error) {
       console.error("Could not access localStorage", error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('sirachat_username');
    } catch (error) {
       console.error("Could not access localStorage", error);
    }
    setUsername(null);
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-6 w-64" />
        </div>
      </div>
    );
  }

  return username ? (
    // If logged in, show the new Chat List Page
    <ChatListPage username={username} onLogout={handleLogout} />
  ) : (
    <UsernameSetup onUsernameSet={handleUsernameSet} />
  );
}
