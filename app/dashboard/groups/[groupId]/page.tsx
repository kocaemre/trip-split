import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus, Users2, Plane, Crown } from "lucide-react";
import AddMemberButton from "./components/add-member-button";
import EditGroupButton from "./components/edit-group-button";


interface GroupPageProps {
  params: {
    groupId: string;
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions);
  const { groupId } = params;

  if (!session?.user?.email) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    return notFound();
  }

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
      trips: true,
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
    redirect("/dashboard");
  }

  // Kullanıcının grup sahibi olup olmadığını kontrol et
  const isOwner = group.ownerId === user.id;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Üst Kısım */}
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Gruplarım
            </Link>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{group.name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center text-gray-500">
                    <Users2 className="w-4 h-4 mr-1" />
                    {group.members.length} üye
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Plane className="w-4 h-4 mr-1" />
                    {group.trips.length} seyahat
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {isOwner && (
                  <EditGroupButton
                    groupId={groupId}
                    groupName={group.name}
                    isOwner={isOwner}
                  />
                )}
                <Button asChild>
                  <Link href={`/dashboard/groups/${groupId}/trips/new`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Yeni Seyahat
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Seyahatler */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Seyahatler</h2>
              {group.trips.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Plane className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Henüz bir seyahat yok
                  </h3>
                  <p className="mt-2 text-gray-500">
                    Bu gruba yeni bir seyahat ekleyerek masrafları takip etmeye başlayın.
                  </p>
                  <Button asChild className="mt-6">
                    <Link href={`/dashboard/groups/${group.id}/trips/new`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Seyahat Ekle
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {group.trips.map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/dashboard/groups/${group.id}/trips/${trip.id}`}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <h3 className="font-medium text-gray-900">{trip.name}</h3>
                        <p className="text-sm text-gray-500">
                          {trip.status === "COMPLETED" ? "Tamamlandı" : "Devam ediyor"}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Detaylar
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Üyeler */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Üyeler</h2>
                {isOwner && <AddMemberButton groupId={group.id} />}
              </div>
              <div className="space-y-3">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {member.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.user.email}
                        </div>
                      </div>
                    </div>
                    {member.user.id === group.ownerId && (
                      <div className="flex items-center text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                        <Crown className="w-3 h-3 mr-1" />
                        Grup Sahibi
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 