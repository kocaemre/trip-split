import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddExpenseButton from "./components/add-expense-button";
import CompleteTripButton from "./components/complete-trip-button";
import EditTripButton from "./components/edit-trip-button";
import { ArrowLeft, Receipt, Users } from "lucide-react";

interface TripPageProps {
  params: {
    groupId: string;
    tripId: string;
  };
}

export default async function TripPage({ params }: TripPageProps) {
  const session = await getServerSession(authOptions);

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

  const trip = await prisma.trip.findUnique({
    where: {
      id: params.tripId,
      groupId: params.groupId,
    },
    include: {
      group: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      expenses: {
        include: {
          paidBy: true,
        },
      },
    },
  });

  if (!trip) {
    return notFound();
  }

  const isMember = trip.group.members.some(
    (member) => member.user.email === session.user.email
  );

  if (!isMember) {
    return notFound();
  }

  const isCreator = trip.createdById === user.id;

  const totalExpenses = trip.expenses.reduce((acc, expense) => acc + expense.amount, 0);

  // Kişi başı düşen miktar
  const perPersonAmount = totalExpenses / trip.group.members.length;

  // Her üyenin ödediği toplam miktar
  const memberPayments = trip.group.members.map((member) => {
    const totalPaid = trip.expenses
      .filter((expense) => expense.paidById === member.user.id)
      .reduce((total, expense) => total + expense.amount, 0);

    return {
      user: member.user,
      totalPaid,
      balance: totalPaid - perPersonAmount,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Üst Kısım */}
          <div>
            <Link
              href={`/dashboard/groups/${params.groupId}`}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              {trip.group.name}
            </Link>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900">{trip.name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center text-gray-500">
                    <Receipt className="w-4 h-4 mr-1" />
                    {trip.expenses.length} harcama
                  </div>
                  <div className="flex items-center text-gray-500">
                    <Users className="w-4 h-4 mr-1" />
                    {trip.group.members.length} kişi
                  </div>
                  <div className="text-gray-500">
                    Toplam: <span className="font-semibold text-gray-900">₺{totalExpenses.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {trip.status !== "COMPLETED" && (
                  <AddExpenseButton tripId={params.tripId} />
                )}
                <EditTripButton
                  tripId={params.tripId}
                  tripName={trip.name}
                  isCreator={isCreator}
                  groupId={params.groupId}
                />
                <CompleteTripButton
                  tripId={params.tripId}
                  isCompleted={trip.status === "COMPLETED"}
                  isCreator={isCreator}
                />
              </div>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Harcamalar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Harcamalar</h2>
              {trip.expenses.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Receipt className="w-12 h-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Henüz bir harcama yok</h3>
                  <p className="mt-2 text-gray-500">
                    Bu seyahate henüz hiç harcama eklenmemiş.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {trip.expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          ₺{expense.amount.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.note || "Not eklenmemiş"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {expense.paidBy.name} tarafından ödendi
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Özet */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Hesap Özeti</h2>
              <div className="space-y-3">
                {memberPayments.map((payment) => (
                  <div
                    key={payment.user.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50"
                  >
                    <div className="font-medium text-gray-900">
                      {payment.user.name}
                    </div>
                    <div
                      className={
                        payment.balance > 0
                          ? "text-emerald-600 font-medium"
                          : payment.balance < 0
                          ? "text-rose-600 font-medium"
                          : "text-gray-600 font-medium"
                      }
                    >
                      {payment.balance > 0
                        ? `Alacaklı: ₺${payment.balance.toFixed(2)}`
                        : payment.balance < 0
                        ? `Borçlu: ₺${Math.abs(payment.balance).toFixed(2)}`
                        : "Ödeşti"}
                    </div>
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