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
import { User, LogIn, Loader2, Check, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useDebounce } from "use-debounce";

const loginSchema = z.object({
  username: z.string().trim().min(3, "Nama pengguna minimal 3 karakter.").max(20, "Nama pengguna maksimal 20 karakter.").regex(/^[a-zA-Z0-9_]+$/, "Nama pengguna hanya boleh berisi huruf, angka, dan garis bawah."),
});

type AuthPageProps = {
    onCreateUser: (username: string) => Promise<void>;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

export default function AuthPage({ onCreateUser }: AuthPageProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
    const { toast } = useToast();

    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: { username: "" },
        mode: "onChange" // Important for real-time validation feedback
    });
    
    const watchedUsername = loginForm.watch("username");
    const [debouncedUsername] = useDebounce(watchedUsername, 500);

    const checkUsernameAvailability = useCallback(async (username: string) => {
        if (!username || loginForm.getFieldState('username').invalid) {
            setUsernameStatus('idle');
            return;
        }
        setUsernameStatus('checking');
        try {
            const usersRef = collection(db, "users");
            
            // Firestore queries are case-sensitive. A common workaround for case-insensitive
            // search is to query a range, but this is not foolproof for all character sets.
            // The most robust solution is to store a normalized (e.g., lowercase) version of the
            // username and query against that. For this app, we'll fetch and compare client-side.
            const q = query(usersRef, where("username", ">=", username), where("username", "<=", username + '\uf8ff'));
            const querySnapshot = await getDocs(q);

            let isTaken = false;
            querySnapshot.forEach((doc) => {
                if(doc.data().username.toLowerCase() === username.toLowerCase()){
                    isTaken = true;
                }
            });

            if (isTaken) {
                setUsernameStatus('taken');
                loginForm.setError("username", { type: "manual", message: "Nama pengguna ini sudah digunakan." });
            } else {
                setUsernameStatus('available');
                loginForm.clearErrors("username"); // Clear error if it becomes available
            }
        } catch (error) {
            console.error("Error checking username:", error);
            setUsernameStatus('idle'); // Reset on error
            toast({ title: "Gagal memeriksa nama pengguna", description: "Periksa koneksi internet Anda.", variant: "destructive" });
        }
    }, [loginForm, toast]);


    useEffect(() => {
        // Clear status if input is cleared or becomes invalid
        if (!debouncedUsername || loginForm.getFieldState('username').invalid) {
            setUsernameStatus('idle');
            // Don't clear manual errors, only validation errors.
            if(loginForm.getValues("username") === "") loginForm.clearErrors("username");
            return;
        }
        checkUsernameAvailability(debouncedUsername);
    }, [debouncedUsername, checkUsernameAvailability, loginForm]);


    async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
        if (usernameStatus !== 'available') {
            toast({ title: "Nama pengguna tidak tersedia", description: "Silakan pilih nama pengguna lain.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreateUser(values.username);
            toast({
              title: "Pendaftaran Berhasil!",
              description: `Selamat datang, ${values.username}!`,
            });
        } catch (error: any) {
             console.error("Error during user creation:", error);
             toast({
                title: "Gagal Membuat Akun",
                description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const renderUsernameFeedback = () => {
        switch (usernameStatus) {
            case 'checking':
                return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
            case 'available':
                return <Check className="h-5 w-5 text-green-500" />;
            case 'taken':
                return <X className="h-5 w-5 text-destructive" />;
            default:
                return null;
        }
    }

    const isSubmitDisabled = isSubmitting || usernameStatus !== 'available';

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
                            <div className="relative">
                                <FormControl>
                                    <Input placeholder="pilih nama unik" {...field} disabled={isSubmitting} autoComplete="off" />
                                </FormControl>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                    {renderUsernameFeedback()}
                                </div>
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
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