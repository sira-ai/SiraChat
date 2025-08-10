
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
      // If user exists, redirect to chat page, but we don't stop loading until redirect is complete
      router.replace('/chat');
    } else {
      // If no user, stop loading and show the auth page
      setIsLoading(false);
    }
  }, [router]);

  const handleLogin = async (username: string) => {
    setIsLoading(true);

    const uid = `user_${username.toLowerCase().replace(/\s+/g, '_')}`;
    const userRef = doc(db, 'users', uid);
    
    try {
      const userSnap = await getDoc(userRef);
      let userProfile: UserProfile;

      if (userSnap.exists()) {
        userProfile = userSnap.data() as UserProfile;
      } else {
        const newProfile: UserProfile = {
          uid: uid,
          username: username,
          email: `${username.toLowerCase()}@sirachat.app`,
          createdAt: new Date().toISOString(),
          avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
        };
        await setDoc(userRef, {
            ...newProfile,
            createdAt: serverTimestamp()
        });
        userProfile = newProfile;
      }

      localStorage.setItem('sira-chat-user', JSON.stringify(userProfile));
      router.push('/chat');

    } catch (error) {
       console.error("Could not verify or create user profile in Firestore. Operating in offline mode.", error);
       const localProfile: UserProfile = {
         uid: uid,
         username: username,
         email: `${username.toLowerCase()}@sirachat.app`,
         createdAt: new Date().toISOString(),
         avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
       };
       localStorage.setItem('sira-chat-user', JSON.stringify(localProfile));
       router.push('/chat');
    } finally {
        // In case of error or if redirection takes time, we should eventually stop loading
        // However, the redirect should handle the view change. If stuck, this might be adjusted.
        // For now, redirection is the primary way to leave this page.
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

  // If not loading and not redirected, show AuthPage
  return <AuthPage onLogin={handleLogin} />;
}
