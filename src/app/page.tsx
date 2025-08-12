
"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user profile in localStorage
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      // If user exists, redirect to chat page. The loading state will be handled by the browser during redirection.
      router.replace('/chat');
    } else {
      // If no user, stop loading and show the auth page
      setIsLoading(false);
    }
  }, [router]);

  const handleCreateUser = async (username: string) => {
    setIsLoading(true);

    const uid = `user_${username.toLowerCase().replace(/\s+/g, '_')}`;
    const userRef = doc(db, 'users', uid);
    
    try {
      // We assume username is already validated for availability by AuthPage
      const newProfile: UserProfile = {
        uid: uid,
        username: username,
        email: `${username.toLowerCase()}@sirachat.app`,
        createdAt: new Date().toISOString(),
        avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
      };

      await setDoc(userRef, {
          ...newProfile,
          createdAt: serverTimestamp(),
          // Default status for new user
          status: 'online',
          lastSeen: serverTimestamp(),
      });
      
      localStorage.setItem('sira-chat-user', JSON.stringify(newProfile));
      router.push('/chat');

    } catch (error) {
       console.error("Could not create user profile in Firestore.", error);
       // Handle error, maybe show a toast to the user
    } 
  };

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

  return <AuthPage onCreateUser={handleCreateUser} />;
}
