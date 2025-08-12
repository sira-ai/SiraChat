"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
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

    // We create a predictable UID, but in a real app, Firebase Auth UIDs are preferred.
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
      
      // Store the full profile to be used immediately by the chat layout
      localStorage.setItem('sira-chat-user', JSON.stringify({ ...newProfile, status: 'online' }));
      router.push('/chat');

    } catch (error) {
       console.error("Could not create user profile in Firestore.", error);
       setIsLoading(false);
       // Here you would show a toast to the user informing them of the failure.
    } 
    // No need to setIsLoading(false) because the redirect will unmount this component.
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

  // If not loading and not redirected, show AuthPage
  return <AuthPage onCreateUser={handleCreateUser} />;
}