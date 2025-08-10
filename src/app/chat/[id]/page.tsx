
"use client";

import ChatPage from "@/components/sirachat/chat-page";
import React from 'react';

// This is a dynamic route for private chats
// The [id] will be the chat room ID
export default function PrivateChat({ params }: { params: { id: string } }) {
  // Use React.use to handle the promise-like nature of params in newer Next.js versions
  const resolvedParams = React.use(Promise.resolve(params));
  return <ChatPage chatId={resolvedParams.id} />;
}
