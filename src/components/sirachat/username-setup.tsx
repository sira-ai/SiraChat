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
import { User } from "lucide-react";

const formSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters.").max(20, "Username must be at most 20 characters."),
});

type UsernameSetupProps = {
  onUsernameSet: (username: string) => void;
};

export default function UsernameSetup({ onUsernameSet }: UsernameSetupProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onUsernameSet(values.username);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg animate-in fade-in-50 zoom-in-95 duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit">
            <User className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold font-headline">Welcome to SiraChat</CardTitle>
          <CardDescription>
            Set your display name to start chatting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Start Chatting
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground text-center w-full">No account needed. Just pick a name and start!</p>
        </CardFooter>
      </Card>
    </main>
  );
}
