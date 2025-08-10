
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
import { SendHorizonal, Smile, Paperclip, Loader2, Image as ImageIcon, FileText as DocumentIcon, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import type { UserProfile } from "@/types";
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
};

type UploadProgress = {
    progress: number;
    fileName: string;
}

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
  const [upload, setUpload] = useState<UploadProgress | null>(null);
  const hasText = !!form.watch("message");

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
      if (currentUser && chatId && !isGlobal) {
          updateTypingStatus(false);
      }
    };
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
        if (form.getValues("message").trim() && !upload) {
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
              <PopoverContent className="w-auto p-0 mb-2 border-0" side="bottom" align="start">
                <Picker 
                  data={async () => {
                    const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
                    return response.json();
                  }} 
                  onEmojiSelect={handleEmojiSelect} 
                  theme="dark" 
                  set="apple" 
                />
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
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground" disabled={!!upload}>
                      {upload ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
                      <span className="sr-only">Lampirkan File</span>
                    </Button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Lampiran</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent align="end" side="bottom" className="w-auto p-2 mb-2 grid grid-cols-2 gap-2">
                <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => fileInputRef.current?.click()} disabled={!!upload}>
                  <ImageIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">Gambar</span>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 w-20" onClick={() => fileInputRef.current?.click()} disabled={!!upload}>
                  <DocumentIcon className="h-8 w-8 mb-1" />
                  <span className="text-xs">Dokumen</span>
                </Button>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" size="icon" disabled={!hasText || form.formState.isSubmitting || !!upload} className="h-12 w-12 rounded-full flex-shrink-0">
            <SendHorizonal className="h-6 w-6" />
            <span className="sr-only">Kirim Pesan</span>
          </Button>
        </form>
      </Form>
    </TooltipProvider>
  );
}
