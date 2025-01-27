"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { Plane, Loader2 } from "lucide-react";

interface CreateTripFormProps {
  groupId: string;
}

export default function CreateTripForm({ groupId }: CreateTripFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const res = await fetch(`/api/groups/${groupId}/trips`, {
        method: "POST",
        body: JSON.stringify({
          name,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      const data = await res.json();
      toast.success("Seyahat başarıyla oluşturuldu!");
      router.push(`/dashboard/groups/${groupId}/trips/${data.id}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Seyahat Adı</Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Plane className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            id="name"
            name="name"
            type="text"
            required
            className="pl-10"
            placeholder="Örn: İtalya Turu"
            disabled={loading}
          />
        </div>
        <p className="text-sm text-gray-500">
          Seyahatinize hatırlaması kolay bir isim verin
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Seyahat oluşturuluyor...
          </>
        ) : (
          "Seyahat Oluştur"
        )}
      </Button>
    </form>
  );
} 