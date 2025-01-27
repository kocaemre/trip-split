"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

interface EditGroupButtonProps {
  groupId: string;
  groupName: string;
  isOwner: boolean;
}

export default function EditGroupButton({
  groupId,
  groupName,
  isOwner,
}: EditGroupButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(groupName);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Bir hata oluştu");
      }

      toast.success("Grup başarıyla güncellendi");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Grup güncellenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/groups/${groupId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Bir hata oluştu");
      }

      toast.success("Grup başarıyla silindi");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Grup silinirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grubu Düzenle</DialogTitle>
            <DialogDescription>
              Grup bilgilerini güncelleyin veya grubu silin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Grup Adı</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex items-center justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={loading}
            >
              Grubu Sil
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                İptal
              </Button>
              <Button onClick={onSubmit} disabled={loading}>
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Grubu Sil</DialogTitle>
            <DialogDescription>
              Bu grubu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz
              ve gruptaki tüm seyahatler ve harcamalar silinecektir.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              İptal
            </Button>
            <Button
              variant="destructive"
              onClick={onDelete}
              disabled={loading}
            >
              {loading ? "Siliniyor..." : "Sil"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 