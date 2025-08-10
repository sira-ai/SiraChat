
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
import { AtSign, CalendarDays, Edit, Loader2, Save, User as UserIcon, X, Crop } from "lucide-react";
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

import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type UserProfileDialogProps = {
  user: UserProfile | null;
  isMyProfile: boolean;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
};

// Helper to center the crop
function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): CropType {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

// Helper to get cropped image data
async function getCroppedImg(image: HTMLImageElement, crop: CropType, fileName: string): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Could not get canvas context');
    }

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Canvas is empty'));
                return;
            }
            resolve(blob);
        }, 'image/png', 1);
    });
}


export default function UserProfileDialog({ user, isMyProfile, open = false, onOpenChange }: UserProfileDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  
  // Cropping state
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<CropType>();
  const [aspect] = useState(1 / 1);
  const imgRef = useRef<HTMLImageElement>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  const resetState = () => {
    setIsEditing(false);
    setIsLoading(false);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppedBlob(null);
    if(user) setUsername(user.username);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  }
  
  if (!user) {
    return null;
  }
  
  const handleEditToggle = () => {
    if (isEditing) {
      resetState();
    }
    setIsEditing(!isEditing);
  }

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined) // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleCropImage = async () => {
     if (!imgRef.current || !completedCrop) {
        toast({ title: "Gagal memotong gambar", description: "Silakan pilih area potong.", variant: "destructive" });
        return;
    }
    const blob = await getCroppedImg(imgRef.current, completedCrop, 'avatar.png');
    setCroppedBlob(blob);
    setImgSrc(''); // Hide the cropper UI
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

        if (croppedBlob) {
            const storageRef = ref(storage, `avatars/${user.uid}/avatar.png`);
            await uploadBytes(storageRef, croppedBlob);
            updates.avatarUrl = await getDownloadURL(storageRef);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
            toast({ title: "Profil berhasil diperbarui!" });
        }

        handleOpenChange(false); // Close dialog on success

    } catch (error) {
        console.error("Error updating profile:", error);
        toast({ title: "Gagal memperbarui profil", description: "Terjadi kesalahan.", variant: "destructive" });
    } finally {
        setIsLoading(false);
    }
  }
  
  const getJoinDate = () => {
    if (!user.createdAt) return 'Tidak diketahui';
    try {
        const date = typeof (user.createdAt as any).toDate === 'function' 
            ? (user.createdAt as any).toDate()
            : new Date(user.createdAt as string);

        if (isNaN(date.getTime())) return 'Tidak diketahui';
        return format(date, 'd MMMM yyyy', { locale: id });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Tidak diketahui';
    }
  }

  const joinDate = getJoinDate();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
         { imgSrc ? (
            <>
                <DialogHeader>
                    <DialogTitle>Potong Gambar Profil</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={aspect}
                        circularCrop
                        minWidth={100}
                    >
                        <img
                            ref={imgRef}
                            alt="Crop me"
                            src={imgSrc}
                            onLoad={onImageLoad}
                            style={{ maxHeight: '70vh' }}
                        />
                    </ReactCrop>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setImgSrc('')}>Batal</Button>
                    <Button onClick={handleCropImage}><Crop className="mr-2 h-4 w-4"/> Potong & Lanjutkan</Button>
                </DialogFooter>
            </>
         ) : (
            <>
                <DialogHeader className="items-center text-center -mb-2 relative">
                    {isMyProfile && !imgSrc && (
                        <div className="absolute top-0 right-0">
                            <Button variant="ghost" size="icon" onClick={handleEditToggle} disabled={isLoading}>
                                {isEditing ? <X className="h-5 w-5" /> : <Edit className="h-5 w-5" />}
                            </Button>
                        </div>
                    )}
                <div className="relative h-24 w-24 mb-4">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={croppedBlob ? URL.createObjectURL(croppedBlob) : user.avatarUrl} alt={username} />
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
                                onChange={onSelectFile}
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
                        <Button onClick={handleSave} disabled={isLoading || (!croppedBlob && username === user.username)} className="w-full">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                )}
            </>
         )}
      </DialogContent>
    </Dialog>
  );
}
