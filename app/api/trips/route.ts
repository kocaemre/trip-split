import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, groupId } = await req.json();

    if (!name || !groupId) {
      return new NextResponse("Eksik bilgi", { status: 400 });
    }

    // Kullanıcının grupta olup olmadığını kontrol et
    const membership = await prisma.userGroup.findFirst({
      where: {
        groupId,
        user: {
          email: session.user.email,
        },
      },
    });

    if (!membership) {
      return new NextResponse("Bu işlem için yetkiniz yok", { status: 403 });
    }

    const trip = await prisma.trip.create({
      data: {
        name,
        groupId,
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("[TRIPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 