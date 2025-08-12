import type { Timestamp } from 'firebase/firestore';

export type Message = {
  id: string;
  text: string;
  sender: string; // username
  senderId?: string; // UID
  timestamp: Timestamp | Date | string; // Allow multiple types for flexibility
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file' | 'sticker';
  fileName?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  replyTo?: {
    messageId: string;
    sender: string;
    text: string;
    attachmentType?: 'image' | 'file' | 'sticker' | null;
  } | null;
};

export type UserProfile = {
    uid: string;
    username: string;
    email: string;
    avatarUrl?: string;
    status?: 'online' | 'offline';
    lastSeen?: Timestamp | Date | string;
    createdAt?: Date | string;
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
    unreadCounts?: { [uid: string]: number };
}
