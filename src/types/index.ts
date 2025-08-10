import type { Timestamp } from 'firebase/firestore';

export type Message = {
  id: string;
  text: string;
  sender: string; // username
  senderId?: string; // UID
  timestamp: Timestamp | Date | string; // Allow multiple types for flexibility
  imageUrl?: string;
  stickerUrl?: string;
};

export type UserProfile = {
    uid: string;
    username: string;
    email: string;
    avatarUrl?: string;
    status?: string;
    createdAt?: Date;
}

export type TypingStatus = {
    isTyping: boolean;
    timestamp: Date;
}
