
"use client";

import { useState, useEffect } from 'react';
import AuthPage from '@/components/sirachat/auth-page';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user profile in localStorage
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
      // If user exists, redirect to chat page
      router.replace('/chat');
    } else {
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
        userProfile = {
          uid: uid,
          username: username,
          email: `${username.toLowerCase()}@sirachat.app`,
          createdAt: new Date(),
          avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
        };
        await setDoc(userRef, {
            ...userProfile,
            createdAt: serverTimestamp()
        });
      }

      localStorage.setItem('sira-chat-user', JSON.stringify(userProfile));
      setCurrentUser(userProfile);
      router.push('/chat');

    } catch (error) {
       console.error("Could not verify or create user profile in Firestore. Operating in offline mode.", error);
       const localProfile: UserProfile = {
         uid: uid,
         username: username,
         email: `${username.toLowerCase()}@sirachat.app`,
         avatarUrl: `https://placehold.co/100x100.png?text=${username.charAt(0).toUpperCase()}`
       };
       localStorage.setItem('sira-chat-user', JSON.stringify(localProfile));
       setCurrentUser(localProfile);
       router.push('/chat');
    } finally {
        setIsLoading(false);
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
