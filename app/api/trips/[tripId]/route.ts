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

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Seyahat adı gerekli" },
        { status: 400 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: params.tripId,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Seyahat bulunamadı" },
        { status: 404 }
      );
    }

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

    // Sadece seyahati oluşturan kişi düzenleyebilir
    if (trip.createdById !== user.id) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const updatedTrip = await prisma.trip.update({
      where: {
        id: params.tripId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedTrip);
  } catch (error) {
    console.error("[TRIP_PATCH]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    const trip = await prisma.trip.findUnique({
      where: {
        id: params.tripId,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { error: "Seyahat bulunamadı" },
        { status: 404 }
      );
    }

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

    // Sadece seyahati oluşturan kişi silebilir
    if (trip.createdById !== user.id) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    // Seyahati ve ilişkili tüm verileri sil
    await prisma.trip.delete({
      where: {
        id: params.tripId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TRIP_DELETE]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 