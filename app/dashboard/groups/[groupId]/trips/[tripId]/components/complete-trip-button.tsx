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
import { CheckCircle } from "lucide-react";

interface CompleteTripButtonProps {
  tripId: string;
  isCreator: boolean;
  isCompleted: boolean;
}

export default function CompleteTripButton({
  tripId,
  isCreator,
  isCompleted,
}: CompleteTripButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onComplete = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trips/${tripId}/complete`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Bir hata oluştu");
      }

      toast.success("Seyahat başarıyla tamamlandı");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Seyahat tamamlanırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  if (!isCreator) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CheckCircle className="w-4 h-4 mr-2" />
          Seyahati Tamamla
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seyahati Tamamla</DialogTitle>
          <DialogDescription>
            Bu seyahati tamamlamak istediğinizden emin misiniz? Bu işlem geri
            alınamaz.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            İptal
          </Button>
          <Button onClick={onComplete} disabled={loading}>
            {loading ? "Tamamlanıyor..." : "Tamamla"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 