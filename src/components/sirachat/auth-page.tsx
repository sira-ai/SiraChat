
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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, LogIn, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  username: z.string().trim().min(3, "Nama pengguna minimal 3 karakter.").max(20, "Nama pengguna maksimal 20 karakter."),
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
});

const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi tidak boleh kosong."),
});


export default function AuthPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: { username: "", email: "", password: "" },
    });

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
        setIsSubmitting(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            // Save user profile to Firestore
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                username: values.username,
                email: values.email,
                createdAt: serverTimestamp(),
                avatarUrl: `https://placehold.co/100x100.png?text=${values.username.charAt(0).toUpperCase()}`
            });
            
            toast({
                title: "Pendaftaran Berhasil!",
                description: "Selamat datang di SiraChat. Anda akan masuk secara otomatis.",
            });
            // The onAuthStateChanged listener in page.tsx will handle the redirect.

        } catch (error: any) {
            console.error("Error registering:", error);
            toast({
                title: "Pendaftaran Gagal",
                description: error.message || "Terjadi kesalahan. Silakan coba lagi.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
             toast({
                title: "Login Berhasil!",
                description: "Selamat datang kembali.",
            });
            // The onAuthStateChanged listener in page.tsx will handle the redirect.
        } catch (error: any) {
             console.error("Error logging in:", error);
            toast({
                title: "Login Gagal",
                description: "Email atau kata sandi salah. Silakan coba lagi.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit mb-4">
            <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold font-headline mb-2">Selamat Datang di SiraChat</h1>
        <p className="text-muted-foreground mb-8">Daftar atau masuk untuk melanjutkan.</p>

        <Tabs defaultValue="login" className="w-full max-w-sm">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login"><LogIn className="mr-2" />Masuk</TabsTrigger>
                <TabsTrigger value="register"><UserPlus className="mr-2"/>Daftar</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Masuk ke Akun Anda</CardTitle>
                        <CardDescription>
                            Gunakan email dan kata sandi Anda untuk melanjutkan.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@contoh.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={loginForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Kata Sandi</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Memproses...' : 'Masuk'}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Buat Akun Baru</CardTitle>
                        <CardDescription>
                        Isi formulir di bawah ini untuk memulai.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Form {...registerForm}>
                        <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                            <FormField
                                control={registerForm.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Nama Pengguna</FormLabel>
                                    <FormControl>
                                        <Input placeholder="pilih nama unik" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={registerForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email@anda.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Kata Sandi</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="minimal 6 karakter" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Mendaftarkan...' : 'Daftar'}
                            </Button>
                        </form>
                        </Form>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    </main>
  );
}
