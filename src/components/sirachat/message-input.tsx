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
import { SendHorizonal, Smile, Paperclip, Loader2, Image as ImageIcon, FileText as DocumentIcon, X, Edit, Check, Reply } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  onSendMessage: (message: string, attachmentUrl?: string, attachmentType?: 'image' | 'file' | 'sticker', fileName?: string) => void;
  currentUser: UserProfile | null;
  chatId: string;
  editingMessage: Message | null;
  onCancelEdit: () => void;
  replyingToMessage: Message | null;
  onCancelReply: () => void;
};

type UploadProgress = {
    progress: number;
    fileName: string;
}

// Debounce timer for typing indicator
let typingTimer: NodeJS.Timeout;

let emojiData: any = null;
async function getEmojiData() {
    if (!emojiData) {
         try {
            const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data/sets/14/apple.json');
            emojiData = await response.json();
        } catch (error) {
            console.error("Failed to load emoji data", error);
        }
    }
    return emojiData;
}


export default function MessageInput({ onSendMessage, currentUser, chatId, editingMessage, onCancelEdit, replyingToMessage, onCancelReply }: MessageInputProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEmojiSheetOpen, setIsEmojiSheetOpen] = useState(false);
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);
  const [upload, setUpload] = useState<UploadProgress | null>(null);
  const [isEmojiDataLoading, setIsEmojiDataLoading] = useState(false);
  
  const hasText = !!form.watch("message");
  const isEditing = !!editingMessage;
  const isReplying = !!replyingToMessage;

  useEffect(() => {
    // Preload emoji data when the component mounts, if not already loaded.
    getEmojiData();
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

   useEffect(() => {
    if(replyingToMessage || editingMessage) {
        textareaRef.current?.focus();
    }
   }, [replyingToMessage, editingMessage])


  // Typing indicator logic
  const updateTypingStatus = async (isTyping: boolean) => {
    if (!currentUser || !chatId) return;
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
      if (currentUser && chatId) {
          updateTypingStatus(false);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, chatId]);


  async function onTextSubmit(values: z.infer<typeof formSchema>) {
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
    setIsAttachmentSheetOpen(false); // Close sheet on selection

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
          form.handleSubmit(onTextSubmit)();
        }
    }
  }
  
  const handleEmojiSelect = (emoji: any) => {
    onSendMessage(emoji.native, undefined, 'sticker');
  }

  const openEmojiSheet = async () => {
    setIsEmojiSheetOpen(true);
    if(!emojiData) {
        setIsEmojiDataLoading(true);
        await getEmojiData();
        setIsEmojiDataLoading(false);
    }
  }

  const cancelAllModes = () => {
    onCancelEdit();
    onCancelReply();
  }

  const getRepliedContentPreview = () => {
    if(!replyingToMessage) return "";
    if (replyingToMessage.text) return replyingToMessage.text;
    if (replyingToMessage.attachmentType === 'image') return "Gambar";
    if (replyingToMessage.attachmentType === 'sticker') return `Stiker ${replyingToMessage.text}`;
    if (replyingToMessage.attachmentType === 'file') return "Dokumen";
    return "";
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
      {(isEditing || isReplying) && (
        <div className="p-2 pt-0">
            <div className="bg-muted p-2 rounded-lg text-sm flex justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                    {isEditing ? <Edit className="h-5 w-5 text-primary flex-shrink-0" /> : <Reply className="h-5 w-5 text-primary flex-shrink-0" />}
                    <div className="min-w-0">
                        <p className="font-bold text-primary truncate">{isEditing ? "Edit Pesan" : `Membalas kepada ${replyingToMessage?.sender}`}</p>
                        <p className="text-muted-foreground truncate">{isEditing ? editingMessage?.text : getRepliedContentPreview()}</p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={cancelAllModes}>
                    <X className="h-4 w-4"/>
                </Button>
            </div>
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onTextSubmit)} className="flex items-end gap-2 p-2">
          <div className="flex-1 flex items-end bg-card rounded-full p-1 pl-3 transition-all duration-300">
            
            <Sheet open={isEmojiSheetOpen} onOpenChange={setIsEmojiSheetOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground" onClick={openEmojiSheet}>
                        <Smile className="h-6 w-6" />
                        <span className="sr-only">Pilih Emoji</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Emoji</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent side="bottom" className="w-full h-[50vh] p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                      <SheetTitle>Pilih Stiker</SheetTitle>
                  </SheetHeader>
                  <div className="flex-1">
                    {isEmojiDataLoading || !emojiData ? (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : (
                        <Picker 
                            data={emojiData} 
                            onEmojiSelect={handleEmojiSelect} 
                            theme="dark"
                        />
                    )}
                  </div>
              </SheetContent>
            </Sheet>

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
            
            <Sheet open={isAttachmentSheetOpen} onOpenChange={setIsAttachmentSheetOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-foreground" disabled={!!upload || isEditing}>
                      {upload ? <Loader2 className="h-6 w-6 animate-spin" /> : <Paperclip className="h-6 w-6" />}
                      <span className="sr-only">Lampirkan File</span>
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Lampiran</p>
                </TooltipContent>
              </Tooltip>
              <SheetContent side="bottom" className="w-full sm:max-w-lg mx-auto rounded-t-lg">
                <SheetHeader>
                    <SheetTitle>Kirim Lampiran</SheetTitle>
                    <SheetDescription>Pilih jenis file yang ingin Anda kirim.</SheetDescription>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button variant="outline" className="flex flex-col h-28 w-full" onClick={() => {fileInputRef.current?.setAttribute('accept', 'image/*'); fileInputRef.current?.click();}} disabled={!!upload}>
                        <ImageIcon className="h-10 w-10 mb-2" />
                        <span className="text-base">Gambar</span>
                    </Button>
                    <Button variant="outline" className="flex flex-col h-28 w-full" onClick={() => {fileInputRef.current?.removeAttribute('accept'); fileInputRef.current?.click();}} disabled={!!upload}>
                        <DocumentIcon className="h-10 w-10 mb-2" />
                        <span className="text-base">Dokumen</span>
                    </Button>
                </div>
              </SheetContent>
            </Sheet>

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
