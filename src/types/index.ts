import type { Timestamp } from 'firebase/firestore';

export type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Timestamp | Date | string; // Allow multiple types for flexibility
  imageUrl?: string;
  stickerUrl?: string;
};

export type UserProfile = {
    username: string;
    avatarUrl?: string;
    status?: string;
}

export type TypingStatus = {
    isTyping: boolean;
    timestamp: Date;
}
