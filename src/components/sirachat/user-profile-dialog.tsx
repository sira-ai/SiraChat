
"use client";

import { UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <DialogHeader className="items-center">
          <Avatar className="h-24 w-24 mb-4">
             <AvatarImage src={user.avatarUrl} alt={user.username} />
            <AvatarFallback className="text-4xl bg-accent text-accent-foreground">
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl">{user.username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <p className="text-center text-sm text-muted-foreground">
                Profil lengkap akan segera tersedia.
            </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
