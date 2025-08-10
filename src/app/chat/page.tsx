
"use client";

import ChatPage from "@/components/sirachat/chat-page";

// This is the new route for the chat page.
// In a real app, this would be a dynamic route like /chat/[id]
// NOTE: This page component is primarily for enabling the route.
// The actual display is handled within the main layout at the root page.
export default function Chat() {
  // We won't render the full page here anymore.
  // The logic is now centralized in the main ChatListPage layout.
  // This just ensures the URL is valid.
  return null;
}
