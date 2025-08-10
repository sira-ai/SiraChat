
# ======================================================================================
# FILE: README.md
# ======================================================================================
```md
# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

```

# ======================================================================================
# FILE: apphosting.yaml
# ======================================================================================
```yaml
# Settings to manage and configure a Firebase App Hosting backend.
# https://firebase.google.com/docs/app-hosting/configure

runConfig:
  # Increase this value if you'd like to automatically spin up
  # more instances in response to increased traffic.
  maxInstances: 1

```

# ======================================================================================
# FILE: components.json
# ======================================================================================
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

# ======================================================================================
# FILE: next.config.ts
# ======================================================================================
```ts
import type {NextConfig} from 'next';
import 'dotenv/config'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      }
    ],
  },
};

export default nextConfig;

```

# ======================================================================================
# FILE: package.json
# ======================================================================================
```json
{
  "name": "nextn",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack -p 9002",
    "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
    "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@emoji-mart/react": "^1.1.1",
    "@genkit-ai/googleai": "^1.14.1",
    "@genkit-ai/next": "^1.14.1",
    "@hookform/resolvers": "^4.1.3",
    "@radix-ui/react-accordion": "^1.2.3",
    "@radix-ui/react-alert-dialog": "^1.1.6",
    "@radix-ui/react-avatar": "^1.1.3",
    "@radix-ui/react-checkbox": "^1.1.4",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-dropdown-menu": "^2.1.6",
    "@radix-ui/react-label": "^2.1.2",
    "@radix-ui/react-menubar": "^1.1.6",
    "@radix-ui/react-popover": "^1.1.6",
    "@radix-ui/react-progress": "^1.1.2",
    "@radix-ui/react-radio-group": "^1.2.3",
    "@radix-ui/react-scroll-area": "^1.2.3",
    "@radix-ui/react-select": "^2.1.6",
    "@radix-ui/react-separator": "^1.1.2",
    "@radix-ui/react-slider": "^1.2.3",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.1.3",
    "@radix-ui/react-tabs": "^1.1.3",
    "@radix-ui/react-toast": "^1.2.6",
    "@radix-ui/react-tooltip": "^1.1.8",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^3.6.0",
    "dotenv": "^16.5.0",
    "embla-carousel-react": "^8.6.0",
    "emoji-mart": "^5.6.0",
    "firebase": "^11.9.1",
    "genkit": "^1.14.1",
    "lucide-react": "^0.475.0",
    "next": "15.3.3",
    "patch-package": "^8.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.2",
    "react-image-crop": "^11.0.5",
    "recharts": "^2.15.1",
    "tailwind-merge": "^3.0.1",
    "tailwindcss-animate": "^1.0.7",
    "uuid": "^9.0.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/uuid": "^9.0.8",
    "genkit-cli": "^1.14.1",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

# ======================================================================================
# FILE: src/ai/dev.ts
# ======================================================================================
```ts
// Flows will be imported for their side effects in this file.

```

# ======================================================================================
# FILE: src/ai/genkit.ts
# ======================================================================================
```ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

```

# ======================================================================================
# FILE: src/app/chat/[id]/page.tsx
# ======================================================================================
```tsx
"use client";

import { useState, useEffect } from 'react';
import ChatPage from "@/components/sirachat/chat-page";
import type { UserProfile } from '@/types';
import { useParams, useRouter } from 'next/navigation';

export default function PrivateChat() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const router = useRouter();
  const params = useParams();
  const chatId = params.id as string;

  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    if(storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      router.push('/');
    }
  }, [router]);

  if (!currentUser) {
    return null; // Or a loading skeleton
  }

  // The 'isGlobal' prop is implicitly false here
  return (
    <ChatPage
      chatId={chatId}
      currentUser={currentUser}
    />
  );
}
```

# ======================================================================================
# FILE: src/app/chat/layout.tsx
# ======================================================================================
```tsx
"use client";

import React, { useState, useEffect } from "react";
import type { UserProfile } from "@/types";
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { LogOut, User } from "lucide-react";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatListPage from "@/components/sirachat/chat-list-page";
import UserProfileDialog from "@/components/sirachat/user-profile-dialog";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const isMobile = useIsMobile();

  // Dialog state
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('sira-chat-user');
    let unsubscribe: (() => void) | null = null;

    if (storedUser) {
      const userData: UserProfile = JSON.parse(storedUser);
      
      const userRef = doc(db, 'users', userData.uid);
      unsubscribe = onSnapshot(userRef, (doc) => {
        if(doc.exists()) {
          const updatedUser = doc.data() as UserProfile;
          setCurrentUser(updatedUser);
          localStorage.setItem('sira-chat-user', JSON.stringify(updatedUser));
        }
      }, (error) => {
        console.error("Failed to listen to user updates:", error);
        setCurrentUser(userData);
      });

    } else {
      router.push('/');
    }
    setIsLoading(false);

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    }
  }, [router]);


  const handleLogout = () => {
    localStorage.removeItem('sira-chat-user');
    setCurrentUser(null);
    router.push('/');
  }

  const handleChatSelect = (chatId: string) => {
    router.push(chatId === 'global' ? '/chat/global' : `/chat/${chatId}`);
  };

  const openMyProfile = () => {
    setIsProfileDialogOpen(true);
  }

  if (isLoading || !currentUser) {
    return (
        <div className="flex h-screen w-screen bg-background">
            <div className="hidden md:flex flex-col w-full max-w-xs border-r p-2 gap-2">
                <Skeleton className="h-[65px] w-full" />
                <Skeleton className="h-full w-full" />
                <Skeleton className="h-[56px] w-full" />
            </div>
            <div className="flex-1 h-screen flex flex-col">
                 <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card h-[69px]">
                     <div className="flex items-center gap-3">
                         <Skeleton className="h-10 w-10 rounded-full" />
                         <div className="min-w-0">
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-4 w-20" />
                         </div>
                     </div>
                     <Skeleton className="h-8 w-8" />
                </header>
                <div className="flex-1" />
                 <footer className="bg-transparent border-t p-2">
                     <Skeleton className="h-12 w-full rounded-full" />
                 </footer>
            </div>
        </div>
    )
  }

  return (
    <>
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <Sidebar className="w-full max-w-xs border-r hidden md:flex">
            <SidebarContent className="p-0">
                <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors cursor-pointer" onClick={openMyProfile}>
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                        <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{currentUser.username}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>

        <main className="flex-1 h-screen">
          {isMobile ? children : (
            <div className="h-full w-full flex">
              <div className="w-full max-w-xs border-r xl:flex flex-col bg-background hidden">
                 <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect}/>
              </div>
              <div className="flex-1 h-screen">
                {children}
              </div>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
    <UserProfileDialog
        user={currentUser}
        isMyProfile={true}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
    />
    </>
  );
}
```

# ======================================================================================
# FILE: src/app/chat/page.tsx
# ======================================================================================
```tsx
"use client";

import ChatListPage from "@/components/sirachat/chat-list-page";
import ChatListContent from "@/components/sirachat/chat-list-content";
import { useState, useEffect } from "react";
import { UserProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";

export default function ChatsRootPage() {
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const router = useRouter();
    const isMobile = useIsMobile();

    useEffect(() => {
        const storedUser = localStorage.getItem('sira-chat-user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else {
            router.push('/');
        }
    }, [router]);

    const handleChatSelect = (chatId: string) => {
        router.push(chatId === 'global' ? '/chat/global' : `/chat/${chatId}`);
    };

    if (isMobile) {
        if (!currentUser) return null; // or a loading state
        return <ChatListContent currentUser={currentUser} onChatSelect={handleChatSelect} />;
    }

    return <ChatListPage />;
}
```

# ======================================================================================
# FILE: src/app/globals.css
# ======================================================================================
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 260 80% 70%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 211 98% 73%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 211 98% 73%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 260 80% 70%;
    --primary-foreground: 210 40% 98%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 211 98% 73%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 211 98% 73%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

# ======================================================================================
# FILE: src/app/layout.tsx
# ======================================================================================
```tsx
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'SiraChat',
  description: 'Aplikasi perpesanan real-time',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

# ======================================================================================
# FILE: src/app/page.tsx
# ======================================================================================
```tsx
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
    } 
    // We don't set loading to false here because the redirect will change the page.
    // If we did, there might be a flash of the AuthPage before redirecting.
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
```

# ======================================================================================
# FILE: src/components/sirachat/auth-page.tsx
# ======================================================================================
```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogIn, Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().trim().min(3, "Nama pengguna minimal 3 karakter.").max(20, "Nama pengguna maksimal 20 karakter.").regex(/^[a-zA-Z0-9_]+$/, "Nama pengguna hanya boleh berisi huruf, angka, dan garis bawah."),
});

type AuthPageProps = {
    onLogin: (username: string) => Promise<void>;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "" },
    });

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        try {
            await onLogin(values.username);
            // The state change in page.tsx will handle the view change.
            toast({
              title: "Login Berhasil!",
              description: `Selamat datang, ${values.username}!`,
            });
        } catch (error: any) {
             console.error("Error during login process:", error);
             loginForm.setError("username", {
                type: "manual",
                message: "Terjadi kesalahan saat masuk.",
            });
             toast({
                title: "Gagal Masuk",
                description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
                variant: "destructive",
            });
        } finally {
            // This now correctly ensures the loading state is always reset
            setIsSubmitting(false);
        }
    }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
            <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold font-headline mb-2">Selamat Datang di SiraChat</h1>
        <p className="text-muted-foreground mb-8">Masukkan nama pengguna untuk melanjutkan.</p>

        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Pilih Nama Pengguna</CardTitle>
                <CardDescription>
                    Ini akan menjadi identitas publik Anda di SiraChat.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Nama Pengguna</FormLabel>
                            <FormControl>
                                <Input placeholder="pilih nama unik" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSubmitting ? 'Memproses...' : 'Lanjutkan'}
                        <LogIn className="ml-2 h-4 w-4"/>
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </main>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/chat-list-content.tsx
# ======================================================================================
```tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Globe } from "lucide-react";
import ChatListItem from "./chat-list-item";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { collection, query, onSnapshot, where, getDocs, addDoc, serverTimestamp, doc, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { UserProfile, Chat } from "@/types";
import { Skeleton } from "../ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from "next/link";
import UserProfileDialog from "./user-profile-dialog";
import { Separator } from "../ui/separator";

type ChatListContentProps = {
  currentUser: UserProfile;
  onChatSelect: (chatId: string) => void;
};

type ChatWithPartner = Chat & {
  partner: UserProfile;
}

function formatTimestamp(timestamp: any) {
    if (!timestamp) return '';
    if (timestamp && typeof timestamp.toDate === 'function') {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true, locale: id });
    }
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: id });
}

export default function ChatListContent({ currentUser, onChatSelect }: ChatListContentProps) {
  const [chats, setChats] = useState<ChatWithPartner[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isNewChatDialogOpen, setIsNewChatDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const router = useRouter();

   useEffect(() => {
    const chatsQuery = query(
      collection(db, "chats"),
      where("members", "array-contains", currentUser.uid)
    );

    const unsubscribe = onSnapshot(chatsQuery, async (querySnapshot) => {
      const chatsData: ChatWithPartner[] = [];
      
      for (const chatDoc of querySnapshot.docs) {
          const chat = chatDoc.data() as Chat;
          const partnerId = chat.members.find(uid => uid !== currentUser.uid);

          if (partnerId) {
             const partnerProfile = chat.memberProfiles[partnerId];
              if (partnerProfile) {
                 chatsData.push({
                    ...chat,
                    id: chatDoc.id,
                    partner: {
                        uid: partnerId,
                        username: partnerProfile.username,
                        avatarUrl: partnerProfile.avatarUrl,
                        email: ''
                    }
                });
              }
          }
      }

      chatsData.sort((a, b) => {
        const timeA = a.lastMessageTimestamp?.toDate?.()?.getTime() || 0;
        const timeB = b.lastMessageTimestamp?.toDate?.()?.getTime() || 0;
        return timeB - timeA;
      });

      setChats(chatsData);
      setIsLoading(false);
    }, (error) => {
        console.error("Error fetching chats: ", error);
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  const handleOpenNewChatDialog = async () => {
    setIsNewChatDialogOpen(true);
    setIsUsersLoading(true);
    try {
      const usersQuery = query(
        collection(db, "users"),
        where("uid", "!=", currentUser.uid)
      );
      const querySnapshot = await getDocs(usersQuery);
      const usersData: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push(doc.data() as UserProfile);
      });
      setUsers(usersData);
    } catch(e) {
      console.error("Failed to fetch users, might be offline or no permissions", e);
    } finally {
      setIsUsersLoading(false);
    }
  }

  const handleCreateOrOpenChat = async (partner: UserProfile) => {
    setIsNewChatDialogOpen(false);
    
    const sortedMembers = [currentUser.uid, partner.uid].sort();
    
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where('members', '==', sortedMembers), limit(1));
    
    try {
      const querySnapshot = await getDocs(q);
    
      if (!querySnapshot.empty) {
        const existingChat = querySnapshot.docs[0];
        onChatSelect(existingChat.id)
      } else {
        const newChatRef = await addDoc(chatsRef, {
          members: sortedMembers,
          memberProfiles: {
            [currentUser.uid]: {
              username: currentUser.username,
              avatarUrl: currentUser.avatarUrl,
            },
            [partner.uid]: {
              username: partner.username,
              avatarUrl: partner.avatarUrl,
            }
          },
          createdAt: serverTimestamp(),
          lastMessage: null,
          lastMessageTimestamp: null,
        });
        onChatSelect(newChatRef.id)
      }
    } catch(e) {
      console.error("Failed to create or open chat", e);
    }
  };


  return (
    <>
    <div className="flex h-full w-full flex-col bg-card">
        <header className="flex items-center justify-between p-3 border-b">
            <h1 className="text-xl font-bold font-headline text-foreground">Obrolan</h1>
            <div className="flex items-center gap-1">
                <Dialog open={isNewChatDialogOpen} onOpenChange={setIsNewChatDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleOpenNewChatDialog}>
                            <Pencil className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Mulai Obrolan Baru</DialogTitle>
                        <DialogDescription>
                            Pilih pengguna di bawah ini untuk memulai percakapan.
                        </DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="max-h-[60vh] -mx-6 px-6">
                            {isUsersLoading ? (
                                <div className="p-3 space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div className="flex items-center gap-3" key={i}>
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <Skeleton className="h-5 w-3/4" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {users.length > 0 ? users.map(user => (
                                        <div key={user.uid} onClick={() => handleCreateOrOpenChat(user)} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors">
                                            <Avatar className="h-11 w-11">
                                                <AvatarImage src={user.avatarUrl} alt={user.username}/>
                                                <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-semibold">{user.username}</p>
                                        </div>
                                    )) : <p className="text-sm text-center text-muted-foreground pt-4">Tidak ada pengguna lain yang ditemukan.</p>}
                                </div>
                            )}
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsProfileDialogOpen(true)}>
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.username} />
                        <AvatarFallback>{currentUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </div>
        </header>

        <ScrollArea className="flex-1">
             {isLoading ? (
                <div className="p-3 space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div className="flex items-center gap-3" key={i}>
                            <Skeleton className="h-14 w-14 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="divide-y divide-border">
                    <div onClick={() => onChatSelect('global')} className="cursor-pointer">
                      <ChatListItem
                          avatar=""
                          isGlobal
                          name="Ruang Obrolan Global"
                          lastMessage="Ngobrol dengan semua pengguna"
                          time=""
                      />
                    </div>
                    
                    {chats.map((chat) => (
                      <div key={chat.id} onClick={() => onChatSelect(chat.id)} className="cursor-pointer">
                        <ChatListItem
                            avatar={chat.partner.avatarUrl || `https://placehold.co/100x100.png`}
                            name={chat.partner.username}
                            lastMessage={chat.lastMessage || `Mulai percakapan...`}
                            time={formatTimestamp(chat.lastMessageTimestamp)}
                        />
                      </div>
                    ))}
                </div>
            )}
        </ScrollArea>
    </div>
    <UserProfileDialog
        user={currentUser}
        isMyProfile={true}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
    />
    </>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/chat-list-item.tsx
# ======================================================================================
```tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { BellOff, Globe } from "lucide-react";
import Image from "next/image";

type ChatListItemProps = {
  avatar: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isMuted?: boolean;
  isTyping?: boolean;
  isGlobal?: boolean;
  dataAiHint?: string;
};

export default function ChatListItem({
  avatar,
  name,
  lastMessage,
  time,
  unreadCount = 0,
  isMuted = false,
  isTyping = false,
  isGlobal = false,
  dataAiHint
}: ChatListItemProps) {
  const hasUnread = unreadCount > 0;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-muted transition-colors cursor-pointer">
      <Avatar className="h-14 w-14 flex-shrink-0">
        {isGlobal ? (
          <div className="w-full h-full flex items-center justify-center rounded-full bg-primary/20 text-primary">
            <Globe className="h-8 w-8" />
          </div>
        ) : (
          <>
            <AvatarImage src={avatar} alt={name} data-ai-hint={dataAiHint}/>
            <AvatarFallback className="text-xl bg-primary text-primary-foreground">
              {name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="font-bold truncate text-foreground">{name}</h2>
          <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{time}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className={cn(
            "text-sm truncate",
            isTyping ? "text-primary" : "text-muted-foreground"
          )}>
            {lastMessage}
          </p>
          <div className="flex items-center gap-1.5 ml-2">
            {isMuted && <BellOff className="h-4 w-4 text-muted-foreground" />}
            {hasUnread && (
              <Badge className="h-6 min-w-6 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/chat-list-page.tsx
# ======================================================================================
```tsx
"use client";

import React from 'react';
import { MessageSquare } from "lucide-react";

export default function ChatListPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-background text-muted-foreground p-4 text-center">
        <MessageSquare className="h-24 w-24 mb-4" />
        <h2 className="text-2xl font-semibold">Selamat Datang di SiraChat</h2>
        <p>Pilih obrolan dari daftar untuk memulai percakapan.</p>
    </div>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/chat-page.tsx
# ======================================================================================
```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message, UserProfile, TypingStatus, Chat } from "@/types";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, Timestamp, doc, getDoc, updateDoc, writeBatch, deleteDoc, getDocs } from "firebase/firestore";
import MessageList from "./message-list";
import MessageInput from "./message-input";
import { Button } from "@/components/ui/button";
import { MoreVertical, Globe, User, PanelLeft, ArrowLeft, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "../ui/skeleton";
import UserProfileDialog from "./user-profile-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSidebar } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type ChatPageProps = {
  isGlobal?: boolean;
  chatId?: string;
  currentUser: UserProfile | null;
};

export default function ChatPage({ isGlobal = false, chatId, currentUser }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isMyProfile, setIsMyProfile] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [chatPartner, setChatPartner] = useState<UserProfile | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    if (!currentUser || (!isGlobal && !chatId)) {
        setIsLoading(isGlobal); 
        return;
    };

    setIsLoading(true); 

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    const messagesQuery = query(collection(db, messagesCollectionPath), orderBy("timestamp", "asc"));
    const messagesUnsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs: Message[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          sender: data.sender,
          senderId: data.senderId,
          timestamp: (data.timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
          attachmentUrl: data.attachmentUrl,
          attachmentType: data.attachmentType,
          fileName: data.fileName,
          isEdited: data.isEdited,
          isDeleted: data.isDeleted,
        };
      });
      setMessages(msgs);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setIsLoading(false);
    });

    let typingUnsubscribe = () => {};
    if (!isGlobal && chatId && currentUser) {
        const typingRef = doc(db, "typingStatus", chatId);
        typingUnsubscribe = onSnapshot(typingRef, (doc) => {
            const data = doc.data() as TypingStatus | undefined;
            const currentTypingUsernames: string[] = [];

            if (data && chatPartner) {
                const partnerStatus = data[chatPartner.uid];
                if (partnerStatus?.isTyping) {
                   currentTypingUsernames.push(partnerStatus.username);
                }
            }
            setTypingUsers(currentTypingUsernames);
        });
    }

    let unsubscribeChat = () => {};
    if (!isGlobal && chatId && currentUser) {
        const chatRef = doc(db, 'chats', chatId);
        unsubscribeChat = onSnapshot(chatRef, async (chatSnap) => {
            if(chatSnap.exists()){
                const chatData = chatSnap.data() as Chat;
                const partnerId = chatData.members.find((id: string) => id !== currentUser.uid);
                if(partnerId) {
                    const partnerProfile = chatData.memberProfiles[partnerId];
                    if (partnerProfile) {
                        setChatPartner({
                            uid: partnerId,
                            username: partnerProfile.username,
                            avatarUrl: partnerProfile.avatarUrl,
                            email: ''
                        });
                    } else {
                       const userRef = doc(db, 'users', partnerId);
                       const userSnap = await getDoc(userRef);
                       if (userSnap.exists()){
                           setChatPartner(userSnap.data() as UserProfile);
                       }
                    }
                }
            } else {
                 console.log("Chat does not exist, redirecting.");
                 toast({ title: "Obrolan tidak ditemukan", description: "Obrolan ini mungkin telah dihapus.", variant: "destructive"});
                 router.push('/chat');
            }
             setIsLoading(false);
        });
    } else {
        setIsLoading(false); 
    }


    return () => {
      messagesUnsubscribe();
      typingUnsubscribe();
      unsubscribeChat();
    }
  }, [currentUser, isGlobal, chatId, router, toast]);

  const handleSendMessage = async (message: string, attachmentUrl?: string, attachmentType?: 'image' | 'file', fileName?: string) => {
    if (!currentUser || (!isGlobal && !chatId)) return;
    if (message.trim() === '' && !attachmentUrl) return;

    if (editingMessage) {
        await handleEditMessage(editingMessage.id, message);
        return;
    }

    const messagesCollectionPath = isGlobal ? "messages" : `chats/${chatId}/messages`;
    
    try {
      await addDoc(collection(db, messagesCollectionPath), {
        text: message || "",
        sender: currentUser.username,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
        attachmentUrl: attachmentUrl || null,
        attachmentType: attachmentType || null,
        fileName: fileName || null,
      });

      if (!isGlobal && chatId) {
          const chatRef = doc(db, "chats", chatId);
          let lastMessageText;
          if (message) {
              lastMessageText = message.length > 30 ? message.substring(0, 30) + "..." : message;
          } else if (attachmentType === 'image') {
              lastMessageText = "Gambar";
          } else if (attachmentType === 'file') {
              lastMessageText = "Dokumen";
          } else {
              lastMessageText = "Lampiran";
          }
          
          await updateDoc(chatRef, {
              lastMessage: lastMessageText,
              lastMessageTimestamp: serverTimestamp()
          });
      }

    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!chatId || isGlobal) return;
    const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
    try {
        await updateDoc(messageRef, {
            text: newText,
            isEdited: true,
            timestamp: serverTimestamp() // Optionally update timestamp
        });
        setEditingMessage(null);
        toast({ title: "Pesan berhasil diedit" });
    } catch (error) {
        console.error("Error editing message:", error);
        toast({ title: "Gagal mengedit pesan", variant: "destructive" });
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!chatId || isGlobal) return;
    const messageRef = doc(db, `chats/${chatId}/messages`, messageId);
    try {
        await updateDoc(messageRef, {
            text: "Pesan ini telah dihapus.",
            attachmentUrl: null,
            attachmentType: null,
            fileName: null,
            isDeleted: true
        });
        toast({ title: "Pesan berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting message:", error);
        toast({ title: "Gagal menghapus pesan", variant: "destructive" });
    }
  }

  const handleDeleteChat = async () => {
    if (!chatId || isGlobal || !currentUser) return;

    try {
        // Delete all messages in the chat subcollection
        const messagesRef = collection(db, `chats/${chatId}/messages`);
        const messagesSnap = await getDocs(messagesRef);
        
        const batch = writeBatch(db);
        messagesSnap.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        // Delete the chat document itself
        const chatRef = doc(db, 'chats', chatId);
        batch.delete(chatRef);

        await batch.commit();

        toast({ title: "Obrolan berhasil dihapus" });
        router.push('/chat');

    } catch (error) {
        console.error("Error deleting chat:", error);
        toast({ title: "Gagal menghapus obrolan", description: "Terjadi kesalahan yang tidak terduga.", variant: "destructive" });
    }
  }
  
  const handleUserSelect = useCallback(async (senderId: string) => {
      if (!currentUser) return;
      
      const isMyProfileSelected = !senderId || senderId === currentUser.uid;
      setIsMyProfile(isMyProfileSelected);

      const targetId = isMyProfileSelected ? currentUser.uid : senderId;

      if (!isGlobal && !isMyProfileSelected && targetId === chatPartner?.uid) {
        setSelectedUser(chatPartner);
        return;
      }
      
      try {
        const userRef = doc(db, 'users', targetId);
        const userSnap = await getDoc(userRef);
        if(userSnap.exists()){
            setSelectedUser(userSnap.data() as UserProfile);
        }
      } catch (e) {
        console.error("Could not fetch user profile, possibly offline.", e);
      }
    }, [isGlobal, currentUser, chatPartner]);

  const getTypingIndicatorText = () => {
    if (typingUsers.length > 0) {
        return `${typingUsers[0]} sedang mengetik...`;
    }
    return chatPartner ? "Online" : "";
  }
  
  const currentChatName = isGlobal ? "Ruang Obrolan Global" : (chatPartner?.username || "Memuat Obrolan...");
  const currentChatAvatar = isGlobal ? undefined : (chatPartner?.avatarUrl || 'https://placehold.co/100x100.png');


  if (isLoading || !currentUser || (!isGlobal && !chatPartner)) {
    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card h-[69px]">
                 <div className="flex items-center gap-3">
                     <Skeleton className="h-10 w-10 rounded-full" />
                     <div className="min-w-0">
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-20" />
                     </div>
                 </div>
                 <Skeleton className="h-8 w-8" />
            </header>
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
                <Skeleton className="h-16 w-3/4 rounded-lg" />
                <Skeleton className="h-20 w-3/4 ml-auto rounded-lg" />
                <Skeleton className="h-16 w-2/4 rounded-lg" />
            </div>
             <footer className="bg-transparent border-t p-2">
                 <Skeleton className="h-12 w-full rounded-full" />
             </footer>
        </div>
    );
  }


  return (
    <>
    <div className="flex h-screen w-full flex-col bg-background">
      <header className="flex items-center justify-between border-b p-3 shadow-sm bg-card">
        <div className="flex items-center gap-3">
            {isMobile && (
              <Button variant="ghost" size="icon" asChild>
                <Link href="/chat">
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Kembali ke daftar obrolan</span>
                </Link>
              </Button>
            )}
            {!isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
                <PanelLeft className="h-6 w-6" />
                <span className="sr-only">Buka Sidebar</span>
              </Button>
            )}
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>
              {isGlobal ? 
                (<div className="w-full h-full flex items-center justify-center rounded-full bg-primary/20 text-primary">
                    <Globe className="h-6 w-6" />
                </div>)
              : <AvatarImage src={currentChatAvatar} alt={currentChatName} />}
              <AvatarFallback className="bg-primary text-primary-foreground">
                {currentChatName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-headline text-foreground leading-tight truncate cursor-pointer" onClick={() => handleUserSelect(chatPartner?.uid!)}>{currentChatName}</h1>
              <p className="text-sm text-primary truncate">
                {isGlobal ? "Ngobrol dengan semua pengguna SiraChat" : getTypingIndicatorText()}
              </p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-6 w-6" />
                      <span className="sr-only">Buka menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUserSelect(chatPartner?.uid!)} disabled={isGlobal}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Info Kontak</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" disabled={isGlobal}>
                            <Trash2 className="mr-2 h-4 w-4"/>
                            <span>Hapus Obrolan</span>
                        </DropdownMenuItem>
                     </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Ini akan menghapus seluruh riwayat percakapan ini secara permanen.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteChat} className="bg-destructive hover:bg-destructive/90">
                        Ya, Hapus
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto" style={{backgroundImage: "url('/chat-bg.png')", backgroundSize: '300px', backgroundRepeat: 'repeat'}}>
        <MessageList 
            messages={messages} 
            currentUser={currentUser} 
            onUserSelect={handleUserSelect} 
            chatPartner={chatPartner}
            onEditMessage={(message) => setEditingMessage(message)}
            onDeleteMessage={handleDeleteMessage}
        />
      </div>
      <footer className="bg-transparent border-t-0 backdrop-blur-sm">
        <MessageInput 
            onSendMessage={handleSendMessage} 
            currentUser={currentUser} 
            chatId={chatId} 
            isGlobal={isGlobal}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
        />
      </footer>
    </div>
    <UserProfileDialog 
        user={selectedUser} 
        isMyProfile={isMyProfile}
        onOpenChange={(open) => !open && setSelectedUser(null)} 
    />
    </>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/message-input.tsx
# ======================================================================================
```tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonal, Smile, Paperclip, Loader2, Image as ImageIcon, FileText as DocumentIcon, X, Edit, Check } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile, Message } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Picker from '@emoji-mart/react';
import { Progress } from "../ui/progress";

const formSchema = z.object({
  message: z.string().max(2000, "Pesan terlalu panjang."),
});

type MessageInputProps = {
  onSendMessage: (message: string, attachmentUrl?: string, attachmentType?: 'image' | 'file', fileName?: string) => void;
  currentUser: UserProfile | null;
  chatId?: string;
  isGlobal?: boolean;
  editingMessage: Message | null;
  onCancelEdit: () => void;
};

type UploadProgress = {
    progress: number;
    fileName: string;
}

// Debounce timer for typing indicator
let typingTimer: NodeJS.Timeout;

export default function MessageInput({ onSendMessage, currentUser, chatId, isGlobal = false, editingMessage, onCancelEdit }: MessageInputProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [isAttachmentPopoverOpen, setAttachmentPopoverOpen] = useState(false);
  const [upload, setUpload] = useState<UploadProgress | null>(null);
  const [emojiData, setEmojiData] = useState(null);
  const hasText = !!form.watch("message");
  const isEditing = !!editingMessage;

  useEffect(() => {
    async function loadEmojiData() {
        try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json');
            const data = await response.json();
            setEmojiData(data);
        } catch (error) {
            console.error("Failed to load emoji data", error);
        }
    }
    loadEmojiData();
  }, []);

  useEffect(() => {
    if (editingMessage) {
      form.setValue("message", editingMessage.text);
      textareaRef.current?.focus();
      setTimeout(adjustTextareaHeight, 0);
    } else {
      form.reset({ message: "" });
      setTimeout(adjustTextareaHeight, 0);
    }
  }, [editingMessage, form]);


  // Typing indicator logic
  const updateTypingStatus = async (isTyping: boolean) => {
    // Only update typing status in private chats
    if (isGlobal || !currentUser || !chatId) return;
    try {
      const typingRef = doc(db, "typingStatus", chatId);
      const updateData = {
        [`${currentUser.uid}`]: {
          isTyping,
          username: currentUser.username,
          timestamp: serverTimestamp(),
        }
      }
      await setDoc(typingRef, updateData, { merge: true });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const handleOnInput = () => {
    adjustTextareaHeight();
    if (!currentUser || isEditing) return;
    
    updateTypingStatus(true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        updateTypingStatus(false);
    }, 2000); // 2 seconds timeout
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
      if (currentUser && chatId && !isGlobal) {
          updateTypingStatus(false);
      }
    };
  }, [currentUser, chatId, isGlobal]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.message.trim()) {
      onSendMessage(values.message);
      if (!isEditing) {
        form.reset({ message: '' });
        textareaRef.current?.focus();
        if (currentUser && chatId) updateTypingStatus(false);
        clearTimeout(typingTimer);
      }
      setTimeout(adjustTextareaHeight, 0);
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUpload({ progress: 0, fileName: file.name });
    setAttachmentPopoverOpen(false); // Close popover on selection

    try {
        const fileType = file.type.startsWith("image/") ? 'image' : 'file';
        const storageRef = ref(storage, `chat-attachments/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUpload({ progress, fileName: file.name });
            },
            (error) => {
                console.error("Error uploading file: ", error);
                toast({
                    title: "Gagal Mengunggah File",
                    description: "Terjadi kesalahan saat mengunggah file Anda. Silakan coba lagi.",
                    variant: "destructive",
                });
                setUpload(null);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                onSendMessage("", downloadURL, fileType, file.name);
                setUpload(null);
            }
        );

    } catch (error) {
        console.error("Error uploading file: ", error);
        toast({
            title: "Gagal Mengunggah File",
            description: "Terjadi kesalahan yang tidak terduga.",
            variant: "destructive",
        });
        setUpload(null);
    } finally {
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'; // Reset height
        const scrollHeight = textareaRef.current.scrollHeight;
        textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if ((hasText || isEditing) && !upload) {
          form.handleSubmit(onSubmit)();
        }
    }
  }
  
  const handleEmojiSelect = (emoji: any) => {
    const currentMessage = form.getValues("message");
    form.setValue("message", currentMessage + emoji.native);
    textareaRef.current?.focus();
    setTimeout(adjustTextareaHeight, 0);
  }

  return (
    <TooltipProvider>
      {upload && (
        <div className="p-2 pt-0">
          <div className="bg-muted p-2 rounded-lg text-sm">
            <div className="flex justify-between items-center mb-1">
              <p className="truncate font-medium text-foreground">{upload.fileName}</p>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setUpload(null)}>
                  <X className="h-4 w-4"/>
              </Button>
            </div>
            <Progress value={upload.progress} className="h-2" />
          </div>
        </div>
      )}
      {isEditing && (
        <div className="p-2 pt-0">
            <div className="bg-muted p-2 rounded-lg text-sm flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Edit className="h-5 w-5 text-primary" />
                    <div>
                        <p className="font-bold text-primary">Edit Pesan</p>
                        <p className="text-muted-foreground line-clamp-1">{editingMessage.text}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onCancelEdit}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 p-2">
          <div className="flex-1 flex items-end bg-card rounded-full p-1 pl-3 transition-all duration-300">
            
            <Popover open={isPickerOpen} onOpenChange={setPickerOpen}>
               <Tooltip>
                <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                            <Smile className="h-6 w-6" />
                            <span className="sr-only">Pilih Emoji</span>
                        </Button>
                    </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Emoji</p>
                </TooltipContent>
               </Tooltip>
              <PopoverContent className="w-auto p-0 mb-2 border-0" side="top" align="start">
                  {emojiData ? (
                      <Picker 
                          data={emojiData} 
                          onEmojiSelect={handleEmojiSelect} 
                          theme="dark"
                      />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center p-4">
                          <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                  )}
              </PopoverContent>
            </Popover>

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Textarea
                      placeholder="Ketik pesan..."
                      className="resize-none bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[20px] max-h-48 py-2.5"
                      rows={1}
                      onKeyDown={handleKeyDown}
                      {...field}
                      ref={textareaRef}
                      onInput={handleOnInput}
                      disabled={!!upload}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

            <Popover open={isAttachmentPopoverOpen} onOpenChange={setAttachmentPopoverOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground" disabled={!!upload || isEditing}>
                                {upload ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
                                <span className="sr-only">Lampirkan File</span>
                            </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Lampiran</p>
                    </TooltipContent>
                </Tooltip>
              <PopoverContent align="end" side="top" className="w-auto p-2 mb-2 grid grid-cols-2 gap-2">
                  <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => {fileInputRef.current?.setAttribute('accept', 'image/*'); fileInputRef.current?.click();}} disabled={!!upload}>
                      <ImageIcon className="h-8 w-8 mb-1" />
                      <span className="text-xs">Gambar</span>
                  </Button>
                  <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => {fileInputRef.current?.removeAttribute('accept'); fileInputRef.current?.click();}} disabled={!!upload}>
                      <DocumentIcon className="h-8 w-8 mb-1" />
                      <span className="text-xs">Dokumen</span>
                  </Button>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" size="icon" disabled={!hasText || form.formState.isSubmitting || !!upload} className="h-12 w-12 rounded-full flex-shrink-0">
            {isEditing ? <Check className="h-6 w-6" /> : <SendHorizonal className="h-6 w-6" />}
            <span className="sr-only">{isEditing ? "Simpan Perubahan" : "Kirim Pesan"}</span>
          </Button>
        </form>
      </Form>
    </TooltipProvider>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/message-item.tsx
# ======================================================================================
```tsx
"use client";

import type { Message, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, CheckCheck, FileText, Download, MoreHorizontal, Copy, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
  onUserSelect: (senderId: string) => void;
  partnerAvatar?: string | null;
  senderProfile?: Pick<UserProfile, 'avatarUrl'>;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
};

function formatTimestamp(timestamp: Message['timestamp']) {
    if (!timestamp) return '';
    const date = new Date(timestamp as string);
    if (isNaN(date.getTime())) return '';
    return format(date, 'p', { locale: id });
}


export default function MessageItem({ message, isCurrentUser, onUserSelect, partnerAvatar, senderProfile, onEditMessage, onDeleteMessage }: MessageItemProps) {
  const { text, sender, senderId, timestamp, attachmentUrl, attachmentType, fileName, isEdited, isDeleted } = message;
  const { toast } = useToast();

  const avatarUrl = isCurrentUser ? undefined : (senderProfile?.avatarUrl || partnerAvatar || `https://placehold.co/100x100.png`);

  const handleCopy = () => {
    if(text) {
        navigator.clipboard.writeText(text);
        toast({ title: "Pesan disalin ke clipboard" });
    }
  }

  const renderAttachment = () => {
    if (!attachmentUrl) return null;

    if (attachmentType === 'image') {
      return (
        <div className="relative aspect-video w-64 my-1">
          <Image 
            src={attachmentUrl} 
            alt="Gambar yang dikirim" 
            fill 
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    }

    if (attachmentType === 'file') {
      return (
        <a 
          href={attachmentUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-3 bg-card/50 hover:bg-card/75 transition-colors p-2 rounded-lg my-1"
        >
            <FileText className="h-8 w-8 text-foreground/80 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">Dokumen</p>
            </div>
            <Download className="h-5 w-5 text-muted-foreground" />
        </a>
      );
    }
    
    return null;
  };

  const MessageContent = (
    <div className={cn("max-w-sm md:max-w-md flex flex-col", 
          isCurrentUser ? "" : "items-start"
      )}>
        <div className={cn(
          "relative rounded-xl p-1.5",
          isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none",
           isDeleted ? "bg-muted text-muted-foreground italic" : ""
        )}>
           {!isCurrentUser && senderId && !isDeleted && (
            <p className="text-sm font-bold text-accent px-1.5 pt-1 cursor-pointer" onClick={() => onUserSelect(senderId)}>{sender}</p>
          )}

          {!isDeleted && renderAttachment()}
          
          {(text || (!attachmentUrl && !isDeleted)) && (
            <div className="flex items-end gap-2 px-1.5 pb-1">
                {text && <p className="text-base whitespace-pre-wrap break-words leading-relaxed pt-1">{text}</p>}
                <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {isEdited && !isDeleted && "Diedit"} {formatTimestamp(timestamp)}
                {isCurrentUser && !isDeleted && <CheckCheck className="w-4 h-4" />}
                </div>
            </div>
          )}

           {(!text && attachmentUrl && !isDeleted) && (
             <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1 float-right clear-both px-1.5 pb-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {formatTimestamp(timestamp)}
                {isCurrentUser && <CheckCheck className="w-4 h-4" />}
             </div>
           )}

        </div>
      </div>
  );

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 animate-in fade-in-25 slide-in-from-bottom-4 duration-500 group",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && senderId && (
        <Button variant="ghost" className="p-0 h-10 w-10 self-start flex-shrink-0 rounded-full" onClick={() => onUserSelect(senderId)}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={sender}/>
              <AvatarFallback className="bg-accent text-accent-foreground">
                {sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
        </Button>
      )}
      
       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="cursor-pointer">
            {MessageContent}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={isCurrentUser ? "end" : "start"} className="w-56">
          <DropdownMenuItem onClick={handleCopy} disabled={!text || isDeleted}>
            <Copy className="mr-2 h-4 w-4" />
            <span>Salin Pesan</span>
          </DropdownMenuItem>
          {isCurrentUser && !isDeleted && (
            <>
              <DropdownMenuItem onClick={() => onEditMessage(message)} disabled={!!attachmentUrl}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit Pesan</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteMessage(message.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Hapus Pesan</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

    </div>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/message-list.tsx
# ======================================================================================
```tsx
"use client";

import { useEffect, useRef } from "react";
import type { Message, UserProfile } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import MessageItem from "./message-item";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type MessageListProps = {
  messages: Message[];
  currentUser: UserProfile | null;
  chatPartner: UserProfile | null;
  onUserSelect: (senderId: string) => void;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
};

export default function MessageList({ messages, currentUser, chatPartner, onUserSelect, onEditMessage, onDeleteMessage }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            const { scrollHeight, clientHeight, scrollTop } = viewport;
            // If user is near the bottom, auto-scroll
            if (scrollHeight - scrollTop < clientHeight + 300) { // Increased threshold
                setTimeout(() => {
                    if (endOfMessagesRef.current) {
                        // Use scrollIntoView with block: 'end' to ensure it goes to the very bottom
                        endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
                    }
                }, 100);
            }
        }
    }
  }, [messages]);
  
  // Scrolls to bottom on initial load
  useEffect(() => {
    setTimeout(() => {
        if (endOfMessagesRef.current) {
            endOfMessagesRef.current.scrollIntoView({ behavior: 'auto', block: 'end' });
        }
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollArea className="h-full w-full p-4" ref={scrollAreaRef}>
        <div className="flex flex-col gap-4">
            {messages.map((message) => (
                <MessageItem
                key={message.id}
                message={message}
                isCurrentUser={message.senderId === currentUser?.uid}
                onUserSelect={onUserSelect}
                partnerAvatar={chatPartner?.avatarUrl}
                onEditMessage={onEditMessage}
                onDeleteMessage={onDeleteMessage}
                />
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    </ScrollArea>
  );
}
```

# ======================================================================================
# FILE: src/components/sirachat/user-profile-dialog.tsx
# ======================================================================================
```tsx
"use client";

import { UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, CalendarDays, Edit, Loader2, Save, User as UserIcon, X, Crop } from "lucide-react";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Label } from "../ui/label";

import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type UserProfileDialogProps = {
  user: UserProfile | null;
  isMyProfile: boolean;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
};

// Helper to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): CropType {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Helper to get cropped image data
async function getCroppedImg(image: HTMLImageElement, crop: CropType, fileName: string): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/png', 1);
    });
}

function updateLocalUser(updatedData: Partial<UserProfile>) {
    const storedUser = localStorage.getItem('sira-chat-user');
    if (storedUser) {
        const user = JSON.parse(storedUser) as UserProfile;
        const newUser = { ...user, ...updatedData };
        localStorage.setItem('sira-chat-user', JSON.stringify(newUser));
    }
}


export default function UserProfileDialog({ user, isMyProfile, open = false, onOpenChange }: UserProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  
  // Cropping state
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const [aspect] = useState(1 / 1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const resetState = () => {
    setIsEditing(false);
    setIsLoading(false);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedBlob(null);
    if(user) setUsername(user.username);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  }
  
  if (!user) {
    return null;
  }
  
  const handleEditToggle = () => {
    if (isEditing) {
      resetState();
    }
    setIsEditing(!isEditing);
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleCropImage = async () => {
     if (!imgRef.current || !completedCrop) {
        toast({ title: "Gagal memotong gambar", description: "Silakan pilih area potong.", variant: "destructive" });
        return;
    }
    const blob = await getCroppedImg(imgRef.current, completedCrop, 'avatar.png');
    setCroppedBlob(blob);
    setImgSrc(''); // Hide the cropper UI
  }

  const handleSave = async () => {
    if (!username.trim()) {
        toast({ title: "Nama pengguna tidak boleh kosong", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    try {
        const userRef = doc(db, 'users', user.uid);
        const updates: Partial<UserProfile> = {};

        if (username !== user.username) {
            updates.username = username;
        }

        if (croppedBlob) {
            const storageRef = ref(storage, `avatars/${user.uid}/avatar.png`);
            await uploadBytes(storageRef, croppedBlob);
            updates.avatarUrl = await getDownloadURL(storageRef);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
            // Crucially, update localStorage after successful Firestore update
            updateLocalUser(updates);
            toast({ title: "Profil berhasil diperbarui!" });
        }

        handleOpenChange(false); // Close dialog on success

    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Gagal memperbarui profil", description: "Terjadi kesalahan.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }
  
  const getJoinDate = () => {
    if (!user.createdAt) return 'Tidak diketahui';
    try {
        const date = typeof (user.createdAt as any).toDate === 'function' 
            ? (user.createdAt as any).toDate()
            : new Date(user.createdAt as string);

        if (isNaN(date.getTime())) return 'Tidak diketahui';
        return format(date, 'd MMMM yyyy', { locale: id });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Tidak diketahui';
    }
  }

  const joinDate = getJoinDate();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
         { imgSrc ? (
            <>
                <DialogHeader>
                    <DialogTitle>Potong Gambar Profil</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        circularCrop
                        minWidth={100}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '70vh' }}
                        />
                    </ReactCrop>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setImgSrc('')}>Batal</Button>
                    <Button onClick={handleCropImage}><Crop className="mr-2 h-4 w-4"/> Potong & Lanjutkan</Button>
                </DialogFooter>
            </>
         ) : (
            <>
                <DialogHeader className="items-center text-center -mb-2 relative">
                    {isMyProfile && !imgSrc && (
                        <div className="absolute top-0 right-0">
                            <Button variant="ghost" size="icon" onClick={handleEditToggle} disabled={isLoading}>
                                {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                            </Button>
                        </div>
                    )}
                <div className="relative h-24 w-24 mb-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={croppedBlob ? URL.createObjectURL(croppedBlob) : user.avatarUrl} alt={username} />
                        <AvatarFallback className="text-4xl bg-accent text-accent-foreground">
                        {username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                        <Button 
                            size="icon" 
                            className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            <Edit className="h-4 w-4"/>
                            <input 
                                type="file" 
                                ref={avatarInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={onSelectFile}
                            />
                        </Button>
                    )}
                </div>
                
                {isEditing ? (
                    <div className="text-left w-full px-4">
                        <Label htmlFor="username" className="text-muted-foreground">Nama Pengguna</Label>
                        <Input 
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="text-lg font-bold text-center h-10"
                        />
                    </div>
                ) : (
                    <DialogTitle className="text-2xl">{user.username}</DialogTitle>
                )}

                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-3 p-3 rounded-lg bg-card/50">
                        <div className="flex items-center gap-4">
                            <AtSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-muted-foreground">Email</p>
                                <p className="text-foreground">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <CalendarDays className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-muted-foreground">Tanggal Bergabung</p>
                                <p className="text-foreground">{joinDate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <UserIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <div className="text-sm">
                                <p className="text-muted-foreground">UID</p>
                                <p className="text-foreground text-xs">{user.uid}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {isEditing && (
                    <DialogFooter>
                        <Button onClick={handleSave} disabled={isLoading || (!croppedBlob && username === user.username)} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                )}
            </>
         )}
      </DialogContent>
    </Dialog>
  );
}
```

# ======================================================================================
# FILE: src/components/ui/accordion.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

# ======================================================================================
# FILE: src/components/ui/alert-dialog.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

# ======================================================================================
# FILE: src/components/ui/alert.tsx
# ======================================================================================
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
```

# ======================================================================================
# FILE: src/components/ui/avatar.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

# ======================================================================================
# FILE: src/components/ui/badge.tsx
# ======================================================================================
```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
```

# ======================================================================================
# FILE: src/components/ui/button.tsx
# ======================================================================================
```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

# ======================================================================================
# FILE: src/components/ui/calendar.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
```

# ======================================================================================
# FILE: src/components/ui/card.tsx
# ======================================================================================
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

# ======================================================================================
# FILE: src/components/ui/carousel.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type CarouselApi = UseEmblaCarouselType[1]
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
type CarouselOptions = UseCarouselParameters[0]
type CarouselPlugin = UseCarouselParameters[1]

type CarouselProps = {
  opts?: CarouselOptions
  plugins?: CarouselPlugin
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0]
  api: ReturnType<typeof useEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: boolean
  canScrollNext: boolean
} & CarouselProps

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute  h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}
```

# ======================================================================================
# FILE: src/components/ui/chart.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"]
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-chart={chartId}
        ref={ref}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "Chart"

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null
      }

      const [item] = payload
      const key = `${labelKey || item.dataKey || item.name || "value"}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label

      if (labelFormatter) {
        return (
          <div className={cn("font-medium", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        )
      }

      if (!value) {
        return null
      }

      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [
      label,
      labelFormatter,
      payload,
      hideLabel,
      labelClassName,
      config,
      labelKey,
    ])

    if (!active || !payload?.length) {
      return null
    }

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            return (
              <div
                key={item.dataKey}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg]",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="font-mono font-medium tabular-nums text-foreground">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltip"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    { className, hideIcon = false, payload, verticalAlign = "bottom", nameKey },
    ref
  ) => {
    const { config } = useChart()

    if (!payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegend"

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
```

# ======================================================================================
# FILE: src/components/ui/checkbox.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

# ======================================================================================
# FILE: src/components/ui/collapsible.tsx
# ======================================================================================
```tsx
"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

# ======================================================================================
# FILE: src/components/ui/dialog.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

# ======================================================================================
# FILE: src/components/ui/dropdown-menu.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

# ======================================================================================
# FILE: src/components/ui/form.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { Slot } from "@radix-ui/react-slot"
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  }
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId()

  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
```

# ======================================================================================
# FILE: src/components/ui/input.tsx
# ======================================================================================
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
```

# ======================================================================================
# FILE: src/components/ui/label.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
```

# ======================================================================================
# FILE: src/components/ui/menubar.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <MenubarPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
MenubarShortcut.displayname = "MenubarShortcut"

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}
```

# ======================================================================================
# FILE: src/components/ui/popover.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

# ======================================================================================
# FILE: src/components/ui/progress.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

# ======================================================================================
# FILE: src/components/ui/radio-group.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

# ======================================================================================
# FILE: src/components/ui/scroll-area.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

# ======================================================================================
# FILE: src/components/ui/select.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/lib/utils"

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
```

# ======================================================================================
# FILE: src/components/ui/separator.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

# ======================================================================================
# FILE: src/components/ui/sheet.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
)

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      <SheetHeader>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navigasi utama dan daftar obrolan</SheetDescription>
      </SheetHeader>
      {children}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

# ======================================================================================
# FILE: src/components/ui/sidebar.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

    if (collapsible === "none") {
      return (
        <aside
          className={cn(
            "flex h-screen flex-col bg-card text-card-foreground",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </aside>
      )
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            className="w-[--sidebar-width] bg-card p-0 text-card-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
              } as React.CSSProperties
            }
            side={side}
          >
            <div className="flex h-full w-full flex-col">{children}</div>
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <aside
        ref={ref}
        className={cn("group hidden h-screen md:flex md:flex-col text-card-foreground bg-card", className)}
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
         {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"


const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 mt-auto", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-auto",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
```

# ======================================================================================
# FILE: src/components/ui/skeleton.tsx
# ======================================================================================
```tsx
import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
```

# ======================================================================================
# FILE: src/components/ui/slider.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

# ======================================================================================
# FILE: src/components/ui/switch.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

# ======================================================================================
# FILE: src/components/ui/table.tsx
# ======================================================================================
```tsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

# ======================================================================================
# FILE: src/components/ui/tabs.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

# ======================================================================================
# FILE: src/components/ui/textarea.tsx
# ======================================================================================
```tsx
import * as React from 'react';

import {cn} from '@/lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<'textarea'>>(
  ({className, ...props}, ref) => {
    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export {Textarea};
```

# ======================================================================================
# FILE: src/components/ui/toast.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

# ======================================================================================
# FILE: src/components/ui/toaster.tsx
# ======================================================================================
```tsx
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

# ======================================================================================
# FILE: src/components/ui/tooltip.tsx
# ======================================================================================
```tsx
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

# ======================================================================================
# FILE: src/hooks/use-client-effect.ts
# ======================================================================================
```ts
"use client"

import { useEffect, type EffectCallback, type DependencyList } from 'react';

/**
 * A custom hook that runs an effect only on the client-side.
 * This is useful for avoiding hydration errors when dealing with
 * browser-specific APIs like localStorage.
 * @param effect - The effect callback to run.
 * @param deps - The dependency array for the effect.
 */
const useClientEffect = (effect: EffectCallback, deps: DependencyList = []) => {
  useEffect(() => {
    // The effect will only run on the client side where `window` is defined.
    effect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useClientEffect;
```

# ======================================================================================
# FILE: src/hooks/use-mobile.tsx
# ======================================================================================
```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

# ======================================================================================
# FILE: src/hooks/use-toast.ts
# ======================================================================================
```ts
"use client"

// Inspired by react-hot-toast library
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
```

# ======================================================================================
# FILE: src/lib/firebase.ts
# ======================================================================================
```ts
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// NOTICE: We are not importing getAuth here anymore

// Your web app's Firebase configuration.
const firebaseConfig = {
  "projectId": "sirachat",
  "appId": "1:600267541023:web:ca1101b27fc02585efe32a",
  "storageBucket": "sirachat.firebasestorage.app",
  "apiKey": "AIzaSyC3_IgR7xCt32tMAkyRh2CxY4WbgFYQdSg",
  "authDomain": "sirachat.firebaseapp.com",
  "messagingSenderId": "600267541023"
};

// Initialize Firebase for SSR
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);
// NOTICE: We are not exporting auth anymore
// const auth = getAuth(app);

export { db, storage, app };
```

# ======================================================================================
# FILE: src/lib/utils.ts
# ======================================================================================
```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

# ======================================================================================
# FILE: src/types/index.ts
# ======================================================================================
```ts
import type { Timestamp } from 'firebase/firestore';

export type Message = {
  id: string;
  text: string;
  sender: string; // username
  senderId?: string; // UID
  timestamp: Timestamp | Date | string; // Allow multiple types for flexibility
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  fileName?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
};

export type UserProfile = {
    uid: string;
    username: string;
    email: string;
    avatarUrl?: string;
    status?: string;
    createdAt?: Date | string;
}

export type TypingStatus = {
  [uid: string]: {
    isTyping: boolean;
    username: string;
    timestamp: Date;
  };
};

export type Chat = {
    id: string;
    members: string[]; // array of UIDs
    memberProfiles: { [uid: string]: Pick<UserProfile, 'username' | 'avatarUrl'> };
    lastMessage?: string | null;
    lastMessageTimestamp?: Timestamp | null;
    createdAt: Timestamp;
}
```

# ======================================================================================
# FILE: tailwind.config.ts
# ======================================================================================
```ts
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['"PT Sans"', 'sans-serif'],
        headline: ['"PT Sans"', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          border: 'hsl(var(--border))',
          ring: 'hsl(var(--ring))',
          accent: 'hsl(var(--accent))',
          'accent-foreground': 'hsl(var(--accent-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
```

# ======================================================================================
# FILE: tsconfig.json
# ======================================================================================
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```
