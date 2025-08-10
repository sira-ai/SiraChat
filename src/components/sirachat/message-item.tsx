"use client";

import type { Message, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, CheckCheck, FileText, Download } from "lucide-react";

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
  onUserSelect: (senderId: string) => void;
  partnerAvatar?: string | null;
  senderProfile?: Pick<UserProfile, 'avatarUrl'>;
};

function formatTimestamp(timestamp: Message['timestamp']) {
    if (!timestamp) return '';
    const date = new Date(timestamp as string);
    if (isNaN(date.getTime())) return '';
    return format(date, 'p', { locale: id });
}


export default function MessageItem({ message, isCurrentUser, onUserSelect, partnerAvatar, senderProfile }: MessageItemProps) {
  const { text, sender, senderId, timestamp, attachmentUrl, attachmentType, fileName } = message;

  // For global chat, use senderProfile. For private, use partnerAvatar for the other user.
  const avatarUrl = isCurrentUser ? undefined : (senderProfile?.avatarUrl || partnerAvatar || `https://placehold.co/100x100.png`);

  const renderAttachment = () => {
    if (!attachmentUrl) return null;

    if (attachmentType === 'image') {
      return (
        <div className="relative aspect-video w-64 my-1">
          <Image 
            src={attachmentUrl} 
            alt="Gambar yang dikirim" 
            fill 
            className="object-cover rounded-lg"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      );
    }

    if (attachmentType === 'file') {
      return (
        <a 
          href={attachmentUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-3 bg-card/50 hover:bg-card/75 transition-colors p-2 rounded-lg my-1"
        >
            <FileText className="h-8 w-8 text-foreground/80 flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">Dokumen</p>
            </div>
            <Download className="h-5 w-5 text-muted-foreground" />
        </a>
      );
    }
    
    return null;
  };

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 animate-in fade-in-25 slide-in-from-bottom-4 duration-500",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && senderId && (
        <Button variant="ghost" className="p-0 h-10 w-10 self-start flex-shrink-0 rounded-full" onClick={() => onUserSelect(senderId)}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={sender}/>
              <AvatarFallback className="bg-accent text-accent-foreground">
                {sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
        </Button>
      )}
      <div className={cn("max-w-sm md:max-w-md flex flex-col", 
          isCurrentUser ? "" : "items-start"
      )}>
        <div className={cn(
          "relative rounded-xl p-1.5",
          isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none",
        )}>
           {!isCurrentUser && senderId && (
            <p className="text-sm font-bold text-accent px-1.5 pt-1 cursor-pointer" onClick={() => onUserSelect(senderId)}>{sender}</p>
          )}

          {renderAttachment()}
          
          {(text || !attachmentUrl) && (
            <div className="flex items-end gap-2 px-1.5 pb-1">
                {text && <p className="text-base whitespace-pre-wrap break-words leading-relaxed pt-1">{text}</p>}
                <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {formatTimestamp(timestamp)}
                {isCurrentUser && <CheckCheck className="w-4 h-4" />}
                </div>
            </div>
          )}

           {(!text && attachmentUrl) && (
             <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1 float-right clear-both px-1.5 pb-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                {formatTimestamp(timestamp)}
                {isCurrentUser && <CheckCheck className="w-4 h-4" />}
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
