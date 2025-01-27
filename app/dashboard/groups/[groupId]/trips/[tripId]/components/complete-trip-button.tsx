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
import { toast } from "react-hot-toast";
import { CheckCircle, PlayCircle } from "lucide-react";

interface CompleteTripButtonProps {
  tripId: string;
  isCompleted: boolean;
  isCreator: boolean;
}

export default function CompleteTripButton({ tripId, isCompleted, isCreator }: CompleteTripButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onComplete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/trips/${tripId}/complete`, {
        method: "PATCH",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      toast.success("Seyahat başarıyla tamamlandı");
      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onReactivate = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/trips/${tripId}/complete`, {
        method: "PUT",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Bir hata oluştu");
      }

      toast.success("Seyahat tekrar aktif hale getirildi");
      router.refresh();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCreator) {
    return null;
  }

  if (isCompleted) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full" disabled={isLoading}>
            <PlayCircle className="w-4 h-4 mr-2" />
            Seyahati Devam Ettir
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Seyahati Devam Ettir</DialogTitle>
            <DialogDescription>
              Seyahati tekrar aktif hale getirmek istediğinize emin misiniz?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              İptal
            </Button>
            <Button
              onClick={onReactivate}
              disabled={isLoading}
            >
              Devam Ettir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" disabled={isLoading}>
          <CheckCircle className="w-4 h-4 mr-2" />
          Seyahati Tamamla
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seyahati Tamamla</DialogTitle>
          <DialogDescription>
            Seyahati tamamlamak istediğinize emin misiniz? Tamamlandıktan sonra yeni harcama eklenemez.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            İptal
          </Button>
          <Button
            onClick={onComplete}
            disabled={isLoading}
          >
            Tamamla
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 