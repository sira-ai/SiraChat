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
  [uid: string]: {
    isTyping: boolean;
    username: string;
    timestamp: Date;
  };
};

export type Chat = {
    id: string;
    members: string[]; // array of UIDs
    memberProfiles: { [uid: string]: Pick<UserProfile, 'username' | 'avatarUrl'> };
    lastMessage?: string | null;
    lastMessageTimestamp?: Timestamp | null;
    createdAt: Timestamp;
}
