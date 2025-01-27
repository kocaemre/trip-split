import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    tripId: string;
  };
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Seyahat bulunamadı" },
        { status: 404 }
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

    // Sadece seyahati oluşturan kişi tamamlayabilir
    if (trip.createdById !== user.id) {
      return NextResponse.json(
        { error: "Sadece seyahati oluşturan kişi tamamlayabilir" },
        { status: 403 }
      );
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: { status: "COMPLETED" },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("[COMPLETE_TRIP]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: { id: params.tripId },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Seyahat bulunamadı" },
        { status: 404 }
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

    // Sadece seyahati oluşturan kişi aktif hale getirebilir
    if (trip.createdById !== user.id) {
      return NextResponse.json(
        { error: "Sadece seyahati oluşturan kişi aktif hale getirebilir" },
        { status: 403 }
      );
    }

    const updatedTrip = await prisma.trip.update({
      where: { id: params.tripId },
      data: { status: "ACTIVE" },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("[REACTIVATE_TRIP]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 