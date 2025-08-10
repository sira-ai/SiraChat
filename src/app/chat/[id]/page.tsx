
"use client";

import ChatPage from "@/components/sirachat/chat-page";
import React from 'react';

// This is a dynamic route for private chats
// The [id] will be the chat room ID
// NOTE: This page component is primarily for enabling the route.
// The actual display is handled within the main layout at the root page.
export default function PrivateChat({ params }: { params: { id: string } }) {
  // We won't render the full page here anymore.
  // The logic is now centralized in the main ChatListPage layout.
  // This just ensures the URL is valid.
  return null;
}
