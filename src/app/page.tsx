
"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import ChatListPage from '@/components/sirachat/chat-list-page';
import { Skeleton } from '@/components/ui/skeleton';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in.
        // Let's check if we have their profile in Firestore.
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          // If profile doesn't exist, create it.
          // We'll use the part of the email before the @ as a default username.
          const username = firebaseUser.email?.split('@')[0] || 'user';
          await setDoc(userRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            username: username,
            createdAt: new Date(),
          });
        }
        setUser(firebaseUser);
      } else {
        // User is signed out.
        setUser(null);
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

  return user ? (
    <ChatListPage username={user.email || 'User'} onLogout={handleLogout} />
  ) : (
    <AuthPage />
  );
}
