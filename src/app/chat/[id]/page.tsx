
"use client";

import ChatPage from "@/components/sirachat/chat-page";

// This is a dynamic route for private chats
// The [id] will be the chat room ID
export default function PrivateChat({ params }: { params: { id: string } }) {
  return <ChatPage chatId={params.id} />;
}
