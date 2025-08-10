
"use client";

import ChatPage from "@/components/sirachat/chat-page";
import React from 'react';

// This is a dynamic route for private chats
// The [id] will be the chat room ID
export default function PrivateChat({ params }: { params: { id: string } }) {
  // Accessing params.id directly is the stable way in this client component.
  // The previous use of React.use was incorrect and caused a promise-related error.
  return <ChatPage chatId={params.id} />;
}
