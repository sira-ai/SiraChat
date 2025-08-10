
"use client";

import React from 'react';
import { MessageSquare } from "lucide-react";

export default function ChatListPage() {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center bg-background text-muted-foreground">
        <MessageSquare className="h-24 w-24 mb-4" />
        <h2 className="text-2xl font-semibold">Selamat Datang di SiraChat</h2>
        <p>Pilih obrolan dari daftar untuk memulai.</p>
    </div>
  );
}
