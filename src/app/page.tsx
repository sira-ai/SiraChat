
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
    // This function is now much simpler.
    // It creates the user profile object and stores it in localStorage.
    // It will also create/update the profile in Firestore.
    setIsLoading(true);

    // Use a consistent UID based on the username for simplicity in this no-auth setup
    // In a real app with auth, you'd use the Firebase Auth UID.
    const uid = `user_${username}`; 
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    let userProfile: UserProfile;

    if (userSnap.exists()) {
      userProfile = userSnap.data() as UserProfile;
    } else {
      // If profile doesn't exist in Firestore, create it.
      userProfile = {
        uid: uid,
        username: username,
        email: `${username}@sirachat.app`, // Dummy email
        createdAt: new Date(), // Use client-side date for now
        avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
      };
      // We wrap this in a try-catch in case firestore rules are not yet permissive
      try {
        await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp() // Use server timestamp when writing
        });
      } catch (error) {
         console.error("Could not save user to firestore. Might be offline or permission issue.", error);
         // Continue anyway, the app can function with local data
      }
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
