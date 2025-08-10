
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
import { SendHorizonal, Smile, Paperclip, Loader2, Image as ImageIcon, Sticker as StickerIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";

const formSchema = z.object({
  message: z.string().max(2000, "Pesan terlalu panjang."),
});

type MessageInputProps = {
  onSendMessage: (message: string, imageUrl?: string, stickerUrl?: string) => void;
};

const emojis = ['😀', '😂', '😍', '🤔', '😎', '😢', '😡', '👍', '👎', '🎉', '❤️', '🙏', '🚀', '🔥', '💡', '💯'];
const stickers = [
    '/stickers/sticker1.png',
    '/stickers/sticker2.png',
    '/stickers/sticker3.png',
    '/stickers/sticker4.png',
    '/stickers/sticker5.png',
    '/stickers/sticker6.png',
    '/stickers/sticker7.png',
    '/stickers/sticker8.png',
];

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [isAttachmentPopoverOpen, setAttachmentPopoverOpen] = useState(false);
  const [isStickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const hasText = !!form.watch("message");

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.message.trim()) {
      onSendMessage(values.message);
      form.reset({ message: '' });
      textareaRef.current?.focus();
      // Ensure height is reset after sending
      setTimeout(adjustTextareaHeight, 0);
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        toast({
            title: "File tidak valid",
            description: "Silakan pilih file gambar.",
            variant: "destructive",
        });
        return;
    }

    setIsUploading(true);
    setAttachmentPopoverOpen(false); // Close popover on selection
    try {
        const storageRef = ref(storage, `chat-images/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        onSendMessage("", downloadURL, undefined);

    } catch (error) {
        console.error("Error uploading image: ", error);
        toast({
            title: "Gagal Mengunggah Gambar",
            description: "Terjadi kesalahan saat mengunggah gambar Anda. Silakan coba lagi.",
            variant: "destructive",
        });
    } finally {
        setIsUploading(false);
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

  const handleStickerSelect = (stickerUrl: string) => {
      onSendMessage("", undefined, stickerUrl);
      setStickerPickerOpen(false);
      setAttachmentPopoverOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 p-2">
        <div className="flex-1 flex items-end bg-card rounded-full p-1 pl-3 transition-all duration-300">
            <Popover open={isEmojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                        <Smile className="h-6 w-6" />
                        <span className="sr-only">Pilih Emoji</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto border-none bg-transparent shadow-none p-0 mb-2">
                     <div className="grid grid-cols-4 gap-2 rounded-lg border bg-popover p-2 shadow-lg w-full">
                        {emojis.map(emoji => (
                            <Button key={emoji} variant="ghost" size="icon" onClick={() => handleEmojiSelect(emoji)} className="text-xl">
                                {emoji}
                            </Button>
                        ))}
                    </div>
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
                      onInput={adjustTextareaHeight}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

            <Popover open={isAttachmentPopoverOpen} onOpenChange={setAttachmentPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                        {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
                        <span className="sr-only">Lampirkan File</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 mb-2 grid grid-cols-2 gap-2">
                     <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                         <ImageIcon className="h-8 w-8 mb-1" />
                         <span className="text-xs">Gambar</span>
                     </Button>
                    <Popover open={isStickerPickerOpen} onOpenChange={setStickerPickerOpen}>
                        <PopoverTrigger asChild>
                             <Button variant="outline" className="flex flex-col h-20 w-20">
                                <StickerIcon className="h-8 w-8 mb-1" />
                                <span className="text-xs">Stiker</span>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto border-none bg-transparent shadow-none p-0 mb-2">
                            <div className="grid grid-cols-4 gap-2 rounded-lg border bg-popover p-4 shadow-lg w-[260px]">
                                {stickers.map(sticker => (
                                    <Button 
                                        key={sticker} 
                                        variant="ghost" 
                                        className="h-auto p-1 aspect-square" 
                                        onClick={() => handleStickerSelect(sticker)}
                                    >
                                        <Image src={sticker} alt="Stiker" width={48} height={48} />
                                    </Button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </PopoverContent>
            </Popover>

        </div>

        <Button type="submit" size="icon" disabled={!hasText || form.formState.isSubmitting} className="h-12 w-12 rounded-full flex-shrink-0">
          <SendHorizonal className="h-6 w-6" />
          <span className="sr-only">Kirim Pesan</span>
        </Button>
      </form>
    </Form>
  );
}

    