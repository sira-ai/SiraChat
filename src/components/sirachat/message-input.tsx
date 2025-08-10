
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
import { SendHorizonal, Smile, Paperclip, Loader2, Image as ImageIcon, FileText as DocumentIcon, ThumbsUp, History, Search } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import type { UserProfile } from "@/types";

const formSchema = z.object({
  message: z.string().max(2000, "Pesan terlalu panjang."),
});

type MessageInputProps = {
  onSendMessage: (message: string, imageUrl?: string, stickerUrl?: string) => void;
  currentUser: UserProfile | null;
  chatId?: string;
  isGlobal?: boolean;
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
    '/stickers/sticker9.png',
    '/stickers/sticker10.png',
    '/stickers/sticker11.png',
    '/stickers/sticker12.png',
];

// Debounce timer for typing indicator
let typingTimer: NodeJS.Timeout;

export default function MessageInput({ onSendMessage, currentUser, chatId, isGlobal = false }: MessageInputProps) {
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
  const [isUploading, setIsUploading] = useState(false);
  const hasText = !!form.watch("message");

  // Typing indicator logic
  const updateTypingStatus = async (isTyping: boolean) => {
    // Only update typing status in private chats
    if (isGlobal || !currentUser || !chatId) return;
    try {
      const typingRef = doc(db, "typingStatus", chatId);
      // We use dot notation to update a specific field in the map
      const updateData = {
        [`${currentUser.uid}`]: {
          isTyping,
          username: currentUser.username,
          timestamp: serverTimestamp(),
        }
      }
      // Use set with merge to create/update the document
      await setDoc(typingRef, updateData, { merge: true });
    } catch (error) {
      console.error("Error updating typing status:", error);
    }
  };

  const handleOnInput = () => {
    adjustTextareaHeight();
    if (!currentUser) return;
    
    updateTypingStatus(true);
    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
        updateTypingStatus(false);
    }, 2000); // 2 seconds timeout
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimer);
      // Clean up typing status on component unmount
      if (currentUser && chatId && !isGlobal) {
          updateTypingStatus(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, chatId, isGlobal]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.message.trim()) {
      onSendMessage(values.message);
      form.reset({ message: '' });
      textareaRef.current?.focus();
      if (currentUser && chatId) updateTypingStatus(false);
      clearTimeout(typingTimer);
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
    textareaRef.current?.focus();
    setTimeout(adjustTextareaHeight, 0);
  }

  const handleStickerSelect = (stickerUrl: string) => {
      onSendMessage("", undefined, stickerUrl);
      setPickerOpen(false);
  }

  return (
    <TooltipProvider>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2 p-2">
          <div className="flex-1 flex items-end bg-card rounded-full p-1 pl-3 transition-all duration-300">
            
            <Popover open={isPickerOpen} onOpenChange={setPickerOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                      <Smile className="h-6 w-6" />
                      <span className="sr-only">Pilih Emoji atau Stiker</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>Emoji & Stiker</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-[calc(100vw-16px)] sm:w-[400px] h-[350px] p-0 mb-2 border-none bg-transparent shadow-none">
                <Tabs defaultValue="emoji" className="h-full w-full bg-card rounded-lg flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4">
                    <TabsContent value="emoji" className="mt-0">
                      <div className="grid grid-cols-8 gap-2">
                        {emojis.map(emoji => (
                          <Button key={emoji} variant="ghost" size="icon" onClick={() => handleEmojiSelect(emoji)} className="text-2xl">
                            {emoji}
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="gif" className="mt-0 flex flex-col items-center justify-center h-full text-muted-foreground">
                        <p className="text-lg">Fitur GIF</p>
                        <p>Segera Hadir!</p>
                    </TabsContent>
                    <TabsContent value="sticker" className="mt-0 space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Cari stiker..." className="pl-10 bg-background" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><History className="h-4 w-4" />Terakhir Digunakan</h3>
                        <div className="grid grid-cols-5 gap-2">
                          {stickers.slice(0, 5).map(sticker => (
                            <Button key={sticker} variant="ghost" className="h-auto p-1 aspect-square bg-background" onClick={() => handleStickerSelect(sticker)}>
                              <Image src={sticker} alt="Stiker" width={64} height={64} />
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><ThumbsUp className="h-4 w-4" />Stiker Trending</h3>
                        <div className="grid grid-cols-5 gap-2">
                          {stickers.map(sticker => (
                            <Button key={sticker} variant="ghost" className="h-auto p-1 aspect-square bg-background" onClick={() => handleStickerSelect(sticker)}>
                              <Image src={sticker} alt="Stiker" width={64} height={64} />
                            </Button>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                  <TabsList className="grid w-full grid-cols-3 rounded-t-none h-12">
                    <TabsTrigger value="emoji" className="h-full text-base">Emoji</TabsTrigger>
                    <TabsTrigger value="gif" className="h-full text-base">GIF</TabsTrigger>
                    <TabsTrigger value="sticker" className="h-full text-base">Stiker</TabsTrigger>
                  </TabsList>
                </Tabs>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />

            <Popover open={isAttachmentPopoverOpen} onOpenChange={setAttachmentPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground">
                      {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
                      <span className="sr-only">Lampirkan File</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  <p>Lampiran</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent align="end" className="w-auto p-2 mb-2 grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                  <ImageIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">Gambar</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 w-20" disabled>
                  <DocumentIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">Dokumen</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" size="icon" disabled={!hasText || form.formState.isSubmitting} className="h-12 w-12 rounded-full flex-shrink-0">
            <SendHorizonal className="h-6 w-6" />
            <span className="sr-only">Kirim Pesan</span>
          </Button>
        </form>
      </Form>
    </TooltipProvider>
  );
}
