import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CreateTripForm from "./components/create-trip-form";

export const metadata: Metadata = {
  title: "Yeni Seyahat Ekle - TripSplit",
  description: "Gruba yeni bir seyahat ekleyin.",
};

interface NewTripPageProps {
  params: {
    groupId: string;
  };
}

export default async function NewTripPage({ params }: NewTripPageProps) {
  const session = await getServerSession(authOptions);
  const groupId = params.groupId;

  const group = await prisma.group.findUnique({
    where: {
      id: groupId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!group) {
    notFound();
  }

  // Kullanıcının grupta olup olmadığını kontrol et
  const isMember = group.members.some(
    (member) => member.user.email === session?.user?.email
  );

  if (!isMember) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center">
          {/* Geri Dön Linki */}
          <div className="w-full max-w-md">
            <Link
              href={`/dashboard/groups/${groupId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {group.name}
            </Link>
          </div>

          {/* Form Kartı */}
          <div className="w-full max-w-md">
            <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  Yeni Seyahat Oluştur
                </h1>
                <p className="mt-2 text-gray-600">
                  {group.name} grubu için yeni bir seyahat oluşturun
                </p>
              </div>

              <CreateTripForm groupId={groupId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 