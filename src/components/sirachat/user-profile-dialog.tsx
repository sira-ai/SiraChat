
"use client";

import { UserProfile } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AtSign, CalendarDays, Edit, Loader2, Save, User as UserIcon, X } from "lucide-react";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Label } from "../ui/label";

type UserProfileDialogProps = {
  user: UserProfile | null;
  isMyProfile: boolean;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function UserProfileDialog({ user, isMyProfile, open = false, onOpenChange }: UserProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setAvatarPreview(user.avatarUrl || null);
    }
  }, [user]);
  
  if (!user) {
    return null;
  }
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Reset state on cancel
      setUsername(user.username);
      setAvatarFile(null);
      setAvatarPreview(user.avatarUrl || null);
    }
    setIsEditing(!isEditing);
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  }

  const handleSave = async () => {
    if (!username.trim()) {
        toast({ title: "Nama pengguna tidak boleh kosong", variant: "destructive" });
        return;
    }
    setIsLoading(true);

    try {
        const userRef = doc(db, 'users', user.uid);
        const updates: Partial<UserProfile> = {};

        if (username !== user.username) {
            updates.username = username;
        }

        if (avatarFile) {
            const storageRef = ref(storage, `avatars/${user.uid}/${avatarFile.name}`);
            await uploadBytes(storageRef, avatarFile);
            updates.avatarUrl = await getDownloadURL(storageRef);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
            toast({ title: "Profil berhasil diperbarui!" });
        }

        setIsEditing(false);

    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Gagal memperbarui profil", description: "Terjadi kesalahan.", variant: "destructive" });
    } finally {
        setIsLoading(false);
        setAvatarFile(null);
        setAvatarPreview(null);
    }
  }
  
  const getJoinDate = () => {
    if (!user.createdAt) return 'Tidak diketahui';
    try {
        // Firestore Timestamps have a toDate() method
        const date = typeof (user.createdAt as any).toDate === 'function' 
            ? (user.createdAt as any).toDate()
            : new Date(user.createdAt);

        if (isNaN(date.getTime())) {
            return 'Tidak diketahui';
        }
        return format(date, 'd MMMM yyyy', { locale: id });
    } catch (e) {
        return 'Tidak diketahui';
    }
  }

  const joinDate = getJoinDate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center -mb-2 relative">
            {isMyProfile && (
                 <div className="absolute top-0 right-0">
                    <Button variant="ghost" size="icon" onClick={handleEditToggle} disabled={isLoading}>
                        {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                    </Button>
                </div>
            )}
          <div className="relative h-24 w-24 mb-4">
            <Avatar className="h-24 w-24">
                <AvatarImage src={avatarPreview || user.avatarUrl} alt={username} />
                <AvatarFallback className="text-4xl bg-accent text-accent-foreground">
                {username.charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            {isEditing && (
                <Button 
                    size="icon" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                    onClick={() => avatarInputRef.current?.click()}
                >
                    <Edit className="h-4 w-4"/>
                    <input 
                        type="file" 
                        ref={avatarInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                    />
                </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="text-left w-full px-4">
                <Label htmlFor="username" className="text-muted-foreground">Nama Pengguna</Label>
                <Input 
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="text-lg font-bold text-center h-10"
                />
            </div>
          ) : (
            <DialogTitle className="text-2xl">{user.username}</DialogTitle>
          )}

        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="space-y-3 p-3 rounded-lg bg-card/50">
                 <div className="flex items-center gap-4">
                    <AtSign className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Email</p>
                        <p className="text-foreground">{user.email}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <CalendarDays className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">Tanggal Bergabung</p>
                        <p className="text-foreground">{joinDate}</p>
                    </div>
                </div>
                 <div className="flex items-center gap-4">
                    <UserIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="text-sm">
                        <p className="text-muted-foreground">UID</p>
                        <p className="text-foreground text-xs">{user.uid}</p>
                    </div>
                </div>
            </div>
        </div>
        {isEditing && (
            <DialogFooter>
                <Button onClick={handleSave} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Simpan Perubahan
                </Button>
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
