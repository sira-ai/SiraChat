
"use client";

import type { Message } from "@/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from "next/image";
import { Button } from "../ui/button";
import { Check, CheckCheck } from "lucide-react";

type MessageItemProps = {
  message: Message;
  isCurrentUser: boolean;
  onUserSelect: (senderId: string) => void;
};

function formatTimestamp(timestamp: Message['timestamp']) {
    if (!timestamp) return '';
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp instanceof Date ? timestamp : timestamp.toDate();
    return format(date, 'p', { locale: id });
}


export default function MessageItem({ message, isCurrentUser, onUserSelect }: MessageItemProps) {
  const { text, sender, senderId, timestamp, imageUrl, stickerUrl } = message;

  return (
    <div
      className={cn(
        "flex items-end gap-2.5 animate-in fade-in-25 slide-in-from-bottom-4 duration-500",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      {!isCurrentUser && (
        <Button variant="ghost" className="p-0 h-10 w-10 self-start flex-shrink-0 rounded-full" onClick={() => onUserSelect(senderId!)}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={`https://placehold.co/100x100.png`} alt={sender}/>
              <AvatarFallback className="bg-accent text-accent-foreground">
                {sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
        </Button>
      )}
      <div className={cn("max-w-sm md:max-w-md flex flex-col p-1.5", 
          isCurrentUser ? "" : "items-start"
      )}>
        <div className={cn(
          "relative rounded-xl",
          isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-card shadow-sm border rounded-bl-none",
          stickerUrl && "bg-transparent border-none shadow-none p-0",
          imageUrl && "p-1.5"
        )}>
           {stickerUrl ? (
             <div className="p-1">
                 <Image src={stickerUrl} alt="Stiker" width={128} height={128} />
             </div>
          ) : (
            <>
              {!isCurrentUser && (
                <p className="text-sm font-bold text-accent px-2.5 pt-2">{sender}</p>
              )}
              {imageUrl && (
                  <div className="relative aspect-square w-64 my-1">
                      <Image 
                          src={imageUrl} 
                          alt="Gambar yang dikirim" 
                          fill 
                          className="object-cover rounded-lg"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                  </div>
              )}
              <div className="flex items-end gap-2 px-2.5 pb-1.5">
                  {text && <p className={cn("text-sm whitespace-pre-wrap break-words", !imageUrl && "pt-2")}>{text}</p>}
                  <div className={cn("text-xs select-none mt-1 self-end shrink-0 flex items-center gap-1", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {formatTimestamp(timestamp)}
                  {isCurrentUser && <CheckCheck className="w-4 h-4" />}
                  </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
