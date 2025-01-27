import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    groupId: string;
  };
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Seyahat adı gerekli" },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    // Grubu bul
    const group = await prisma.group.findUnique({
      where: {
        id: params.groupId,
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
      return NextResponse.json(
        { error: "Grup bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının grupta olup olmadığını kontrol et
    const isMember = group.members.some(
      (member) => member.user.email === session.user.email
    );

    if (!isMember) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    // Yeni seyahati oluştur
    const trip = await prisma.trip.create({
      data: {
        name,
        groupId: params.groupId,
        createdById: user.id,
      },
      include: {
        createdBy: true,
      },
    });

    return NextResponse.json(trip);
  } catch (error) {
    console.error("[TRIPS_POST]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 