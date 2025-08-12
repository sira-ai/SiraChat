"use client";

import type { Message, UserProfile } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from "next/image";
import { Button } from "../ui/button";
import { CheckCheck, FileText, Download, Copy, Edit, Trash2, Reply, ImageIcon, File as FileIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
  onUserSelect: (senderId: string) => void;
  partnerAvatar?: string | null;
  senderProfile?: Pick<UserProfile, 'avatarUrl'>;
  onEditMessage: (message: Message) => void;
  onDeleteMessage: (messageId: string) => void;
  onReplyMessage: (message: Message) => void;
};

function formatTimestamp(timestamp: Message['timestamp']) {
    if (!timestamp) return '';
    const date = new Date(timestamp as string);
    if (isNaN(date.getTime())) return '';
    return format(date, 'p', { locale: id });
}


export default function MessageItem({ message, isCurrentUser, onUserSelect, partnerAvatar, senderProfile, onEditMessage, onDeleteMessage, onReplyMessage }: MessageItemProps) {
  const { text, sender, senderId, timestamp, attachmentUrl, attachmentType, fileName, isEdited, isDeleted, replyTo } = message;
  const { toast } = useToast();

  const avatarUrl = isCurrentUser ? undefined : (senderProfile?.avatarUrl || partnerAvatar || `https://placehold.co/100x100.png`);

  const handleCopy = () => {
    if(text && !isDeleted && attachmentType !== 'sticker') {
        navigator.clipboard.writeText(text);
        toast({ title: "Teks pesan disalin" });
    }
  }

  const renderRepliedMessage = () => {
    if (!replyTo) return null;

    let repliedContent: React.ReactNode = replyTo.text;
    if (replyTo.attachmentType === 'sticker') {
      repliedContent = <span className="flex items-center gap-1.5">Stiker {replyTo.text}</span>
    } else if (replyTo.attachmentType === 'image') {
      repliedContent = <span className="flex items-center gap-1.5"><ImageIcon className="h-4 w-4"/> Gambar</span>
    } else if (replyTo.attachmentType === 'file') {
      repliedContent = <span className="flex items-center gap-1.5"><FileIcon className="h-4 w-4"/> Dokumen</span>
    }

    return (
        <div className="relative bg-black/10 dark:bg-black/20 p-2 rounded-md mb-1 ml-1.5 mr-1.5 border-l-2 border-primary">
            <p className="font-bold text-sm text-primary">{replyTo.sender}</p>
            <p className="text-sm text-foreground/80 truncate">{repliedContent}</p>
        </div>
    )
  }
  
  const renderSticker = () => {
     if (attachmentType !== 'sticker') return null;
     return (
        <div className="text-6xl p-2">
            {text}
        </div>
     )
  }

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

  const MessageBubble = (
    <div className={cn(
        "relative rounded-xl p-1.5 pt-0.5",
        isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none",
        isDeleted ? "bg-muted text-muted-foreground italic" : "",
        attachmentType === 'sticker' && !replyTo ? "bg-transparent border-0 shadow-none" : "",
    )}>
       {!isCurrentUser && senderId && !isDeleted && (
        <p className="text-sm font-bold text-accent px-1.5 pt-1 cursor-pointer" onClick={() => onUserSelect(senderId)}>{sender}</p>
      )}

      {!isDeleted && renderRepliedMessage()}
      {!isDeleted && renderAttachment()}
      {!isDeleted && renderSticker()}
      
      {(text && attachmentType !== 'sticker' || isDeleted) && (
        <div className="flex items-end gap-2 px-1.5 pb-1">
            {text && <p className="text-base whitespace-pre-wrap break-words leading-relaxed pt-1">{text}</p>}
            <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
            {isEdited && !isDeleted && "Diedit"} {formatTimestamp(timestamp)}
            {isCurrentUser && !isDeleted && <CheckCheck className="w-4 h-4" />}
            </div>
        </div>
      )}

      {((!text && attachmentUrl) || (attachmentType === 'sticker' && replyTo)) && !isDeleted && (
          <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1 float-right clear-both px-1.5 pb-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
           {formatTimestamp(timestamp)}
           {isCurrentUser && <CheckCheck className="w-4 h-4" />}
          </div>
      )}
    </div>
  );

  return (
    <div
      className={cn(
        "group relative flex w-full items-start gap-2.5 animate-in fade-in-25 slide-in-from-bottom-4 duration-500",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex items-end gap-2.5",
          isCurrentUser ? "flex-row-reverse" : "flex-row"
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
        
        <div className="max-w-sm md:max-w-md flex flex-col">
          {MessageBubble}
        </div>

        <div className="flex-shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100">
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Opsi Lainnya</span>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                  <DropdownMenuItem onClick={() => onReplyMessage(message)} disabled={isDeleted}>
                      <Reply className="mr-2 h-4 w-4" />
                      <span>Balas</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy} disabled={!text || isDeleted || attachmentType === 'sticker'}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Salin Teks</span>
                  </DropdownMenuItem>
                  {isCurrentUser && !isDeleted && (
                  <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditMessage(message)} disabled={!!attachmentUrl || attachmentType==='sticker'}>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDeleteMessage(message.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Hapus</span>
                      </DropdownMenuItem>
                  </>
                  )}
              </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
