"use client";

import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, isToday, isYesterday } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from "next/image";
import { Button } from "../ui/button";

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
  onUserSelect: (sender: string) => void;
};

function formatTimestamp(timestamp: Message['timestamp']) {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp instanceof Date ? timestamp : timestamp.toDate();
    
    if(isToday(date)) {
        return format(date, 'p', { locale: id });
    }
    if(isYesterday(date)) {
        return `Kemarin ${format(date, 'p', { locale: id })}`;
    }
    return format(date, 'd MMM yyyy, p', { locale: id });
}


export default function MessageItem({ message, isCurrentUser, onUserSelect }: MessageItemProps) {
  const { text, sender, timestamp, imageUrl, stickerUrl } = message;

  return (
    <div
      className={cn(
        "flex items-end gap-2 animate-in fade-in-25 slide-in-from-bottom-4 duration-500",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Button variant="ghost" className="p-0 h-8 w-8 flex-shrink-0 rounded-full" onClick={() => onUserSelect(sender)}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-accent text-accent-foreground">
                {sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
        </Button>
      )}
      <div className={cn("max-w-xs md:max-w-md lg:max-w-lg rounded-2xl", 
        isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none",
        stickerUrl && "bg-transparent border-none shadow-none"
      )}>
        {stickerUrl ? (
             <div className="p-1">
                 <Image src={stickerUrl} alt="Stiker" width={128} height={128} />
             </div>
        ) : (
            <div className="p-1">
                <div className="p-2">
                    {!isCurrentUser && (
                    <p className="text-xs font-bold text-accent-foreground px-2">{sender}</p>
                    )}
                    {imageUrl && (
                        <div className="relative aspect-video w-64 my-2">
                            <Image 
                                src={imageUrl} 
                                alt="Gambar yang dikirim" 
                                fill 
                                className="object-cover rounded-lg"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    )}
                    {text && <p className="text-sm whitespace-pre-wrap break-words px-2">{text}</p>}
                    <p className={cn("text-xs mt-1 text-right px-2", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {formatTimestamp(timestamp)}
                    </p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
