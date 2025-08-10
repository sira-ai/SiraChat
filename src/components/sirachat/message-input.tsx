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
import { SendHorizonal } from "lucide-react";
import { useRef } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Message cannot be empty.").max(1000, "Message is too long."),
});

type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSendMessage(values.message);
    form.reset();
    textareaRef.current?.focus();
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (form.getValues("message").trim()) {
          form.handleSubmit(onSubmit)();
        }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type a message..."
                  className="resize-none min-h-[40px] max-h-40"
                  rows={1}
                  onKeyDown={handleKeyDown}
                  {...field}
                  ref={textareaRef}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = `${target.scrollHeight}px`;
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={!form.formState.isValid || form.formState.isSubmitting} className="h-10 w-10 flex-shrink-0">
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Send Message</span>
        </Button>
      </form>
    </Form>
  );
}
