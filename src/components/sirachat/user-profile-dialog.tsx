
"use client";

import { UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, Phone } from "lucide-react";

type UserProfileDialogProps = {
  user: UserProfile | null;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileDialog({ user, onOpenChange }: UserProfileDialogProps) {
  if (!user) {
    return null;
  }

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
             <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="text-4xl bg-accent text-accent-foreground">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl">{user.username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Info</h4>
                 <div className="flex items-center gap-3">
                    <AtSign className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Email</p>
                        <p className="text-foreground">{user.email}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Telepon</p>
                        <p className="text-foreground italic">Tidak ada</p>
                    </div>
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
