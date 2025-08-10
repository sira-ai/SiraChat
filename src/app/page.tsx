
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

    const uid = `user_${username.toLowerCase().replace(/\s+/g, '_')}`; // Create a more robust UID
    const userRef = doc(db, 'users', uid);
    
    try {
      const userSnap = await getDoc(userRef);
      let userProfile: UserProfile;

      if (userSnap.exists()) {
        // If profile exists in Firestore, use it as the source of truth
        userProfile = userSnap.data() as UserProfile;
      } else {
        // If profile doesn't exist, create a new one
        userProfile = {
          uid: uid,
          username: username,
          email: `${username.toLowerCase()}@sirachat.app`, // Dummy email
          createdAt: new Date(), // Use client-side date for local object
          avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
        };
        // Save the new profile to Firestore
        await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp() // Use server timestamp when writing to DB
        });
      }

      // Store the definitive profile in localStorage and state
      localStorage.setItem('sira-chat-user', JSON.stringify(userProfile));
      setCurrentUser(userProfile);

    } catch (error) {
       console.error("Could not verify or create user profile in Firestore. Operating in offline mode.", error);
       // Fallback for offline mode: create a local-only profile
       const localProfile: UserProfile = {
         uid: uid,
         username: username,
         email: `${username.toLowerCase()}@sirachat.app`,
         avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
       };
       localStorage.setItem('sira-chat-user', JSON.stringify(localProfile));
       setCurrentUser(localProfile);
    } finally {
        setIsLoading(false);
    }
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
