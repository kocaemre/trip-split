import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Users2, Plane } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Kullanıcının üyesi olduğu grupları getir
  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          user: {
            email: session.user.email
          }
        }
      }
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
      trips: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Gruplarım</h1>
        <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Link href="/dashboard/groups/new">
            <Plus className="w-4 h-4 mr-2" />
            Yeni Grup
          </Link>
        </Button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-12">
          <Users2 className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Henüz bir grubunuz yok
          </h3>
          <p className="mt-2 text-gray-500">
            Yeni bir grup oluşturarak seyahat masraflarınızı takip etmeye başlayın.
          </p>
          <Button asChild className="mt-6">
            <Link href="/dashboard/groups/new">
              <Plus className="w-4 h-4 mr-2" />
              Grup Oluştur
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/dashboard/groups/${group.id}`}
              className="block p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {group.name}
              </h2>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center">
                  <Users2 className="w-4 h-4 mr-1" />
                  {group.members.length} üye
                </div>
                <div className="flex items-center">
                  <Plane className="w-4 h-4 mr-1" />
                  {group.trips.length} seyahat
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 