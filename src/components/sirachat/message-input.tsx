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
import { SendHorizonal, Smile, Image as ImageIcon, PlusCircle, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  message: z.string().max(2000, "Pesan terlalu panjang."),
});

type MessageInputProps = {
  onSendMessage: (message: string) => void;
};

const emojis = ['😀', '😂', '😍', '🤔', '😎', '😢', '😡', '👍', '👎', '🎉', '❤️', '🙏', '🚀', '🔥', '💡', '💯'];


export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.message.trim()) {
      onSendMessage(values.message);
      form.reset({ message: '' });
      textareaRef.current?.focus();
      adjustTextareaHeight();
    }
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        if (form.getValues("message").trim()) {
          form.handleSubmit(onSubmit)();
        }
    }
  }
  
  const handleEmojiSelect = (emoji: string) => {
    const currentMessage = form.getValues("message");
    form.setValue("message", currentMessage + emoji);
    setEmojiPickerOpen(false);
    textareaRef.current?.focus();
    setTimeout(adjustTextareaHeight, 0);
  }

  const handleFeatureClick = (featureName: string) => {
    toast({
        title: "Fitur Segera Hadir",
        description: `Fungsionalitas untuk ${featureName} sedang dalam pengembangan.`,
        duration: 3000,
    });
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
        
        <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0">
                    <Smile className="h-5 w-5" />
                    <span className="sr-only">Pilih Emoji</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto border-none bg-transparent shadow-none">
                 <div className="grid grid-cols-4 gap-2 rounded-lg border bg-popover p-2 shadow-lg">
                    {emojis.map(emoji => (
                        <Button key={emoji} variant="ghost" size="icon" onClick={() => handleEmojiSelect(emoji)} className="text-xl">
                            {emoji}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" className="flex-shrink-0" type="button" onClick={() => handleFeatureClick('kirim gambar')}>
            <ImageIcon className="h-5 w-5" />
            <span className="sr-only">Kirim Gambar</span>
        </Button>
        <Button variant="ghost" size="icon" className="flex-shrink-0 hidden sm:inline-flex" type="button" onClick={() => handleFeatureClick('kirim stiker')}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 16.5a.5.5 0 0 1-1 0V9a1 1 0 0 0-1-1H4.5a.5.5 0 0 1 0-1H10a2 2 0 0 1 2 2v7.5Z"/><path d="M3 7.5a.5.5 0 0 1 1 0v9a1 1 0 0 0 1 1h8.5a.5.5 0 0 1 0 1H5a2 2 0 0 1-2-2Z"/></svg>
            <span className="sr-only">Kirim Stiker</span>
        </Button>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Ketik pesan..."
                  className="resize-none min-h-[40px] max-h-48"
                  rows={1}
                  onKeyDown={handleKeyDown}
                  {...field}
                  ref={textareaRef}
                  onInput={adjustTextareaHeight}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="icon" disabled={!form.getValues("message").trim() || form.formState.isSubmitting} className="h-10 w-10 flex-shrink-0">
          <SendHorizonal className="h-5 w-5" />
          <span className="sr-only">Kirim Pesan</span>
        </Button>
      </form>
    </Form>
  );
}
