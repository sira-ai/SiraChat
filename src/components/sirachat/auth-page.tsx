
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
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const loginSchema = z.object({
  username: z.string().trim().min(3, "Nama pengguna minimal 3 karakter.").max(20, "Nama pengguna maksimal 20 karakter.").regex(/^[a-zA-Z0-9_]+$/, "Nama pengguna hanya boleh berisi huruf, angka, dan garis bawah."),
});

type AuthPageProps = {
    onLogin: (username: string) => Promise<void>;
}

export default function AuthPage({ onLogin }: AuthPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "" },
    });

    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        try {
            // Optional: check if username is already taken, though the logic in Home page handles creation.
            // For simplicity, we just call the login handler.
            await onLogin(values.username);
            // The state change in page.tsx will handle the view change.
        } catch (error: any) {
             console.error("Error during login process:", error);
             loginForm.setError("username", {
                type: "manual",
                message: "Terjadi kesalahan saat masuk.",
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
