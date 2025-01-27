import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: {
    groupId: string;
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
        { error: "Grup adı gerekli" },
        { status: 400 }
      );
    }

    const group = await prisma.group.findUnique({
      where: {
        id: params.groupId,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Grup bulunamadı" },
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

    // Sadece grup sahibi düzenleyebilir
    if (group.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    const updatedGroup = await prisma.group.update({
      where: {
        id: params.groupId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("[GROUP_PATCH]", error);
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

    const group = await prisma.group.findUnique({
      where: {
        id: params.groupId,
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: "Grup bulunamadı" },
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

    // Sadece grup sahibi silebilir
    if (group.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Bu işlem için yetkiniz yok" },
        { status: 403 }
      );
    }

    // Grubu ve ilişkili tüm verileri sil
    await prisma.group.delete({
      where: {
        id: params.groupId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[GROUP_DELETE]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu" },
      { status: 500 }
    );
  }
} 