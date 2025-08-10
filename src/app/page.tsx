
"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import ChatListPage from '@/components/sirachat/chat-list-page';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for user profile in localStorage
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (username: string) => {
    setIsLoading(true);
    const userRef = doc(db, 'users', username); // Use username as ID
    const userSnap = await getDoc(userRef);
    
    let userProfile: UserProfile;

    if (userSnap.exists()) {
      userProfile = userSnap.data() as UserProfile;
    } else {
      // If profile doesn't exist, create it.
      const newUid = uuidv4(); // Generate a unique ID for the user
      const newUserProfile: UserProfile = {
        uid: newUid, // Use a generated UID
        username: username,
        email: `${username}@sirachat.app`, // Dummy email
        createdAt: serverTimestamp() as unknown as Date,
        avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
      };
      await setDoc(doc(db, "users", newUid), newUserProfile); // Save user with UID as doc ID
      userProfile = newUserProfile;
    }

    localStorage.setItem('sira-chat-user', JSON.stringify(userProfile));
    setCurrentUser(userProfile);
    setIsLoading(false);
  };


  const handleLogout = () => {
    localStorage.removeItem('sira-chat-user');
    setCurrentUser(null);
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

  return currentUser ? (
    <ChatListPage currentUser={currentUser} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  );
}
