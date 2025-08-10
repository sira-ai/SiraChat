
"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import ChatListPage from '@/components/sirachat/chat-list-page';
import { Skeleton } from '@/components/ui/skeleton';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        // Let's check if we have their profile in Firestore.
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        
        let userProfile: UserProfile;

        if (userSnap.exists()) {
          userProfile = userSnap.data() as UserProfile;
        } else {
          // If profile doesn't exist, create it.
          const username = firebaseUser.email?.split('@')[0] || `user_${firebaseUser.uid.substring(0, 5)}`;
          const newUserProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            username: username,
            createdAt: serverTimestamp() as unknown as Date,
            avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
          };
          await setDoc(userRef, newUserProfile);
          
          // Re-fetch to get the server-generated timestamp correctly
          const freshUserSnap = await getDoc(userRef);
          userProfile = freshUserSnap.data() as UserProfile;
        }
        setCurrentUser(userProfile);
      } else {
        // User is signed out.
        setCurrentUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleLogout = async () => {
    try {
      await auth.signOut();
      // The onAuthStateChanged listener will handle setting user to null.
    } catch (error) {
       console.error("Error signing out:", error);
    }
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
    <AuthPage />
  );
}
