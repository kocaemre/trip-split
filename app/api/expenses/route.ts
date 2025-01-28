import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, tripId, note } = body;

    if (!amount || !tripId) {
      return NextResponse.json(
        { error: "Miktar ve seyahat ID'si gerekli" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Seyahati bul ve durumunu kontrol et
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
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
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Seyahat bulunamadı" },
        { status: 404 }
      );
    }

    // Seyahat tamamlanmışsa harcama eklenemez
    if (trip.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Tamamlanmış seyahate harcama eklenemez" },
        { status: 400 }
      );
    }

    // Kullanıcının grupta olup olmadığını kontrol et
    const isMember = trip.group.members.some(
      (member) => member.user.email === session.user.email
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        note,
        tripId,
        paidById: user.id,
      },
      include: {
        paidBy: true,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSES_POST]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 