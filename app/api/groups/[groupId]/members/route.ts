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
    console.log("Session:", session);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Bu işlem için giriş yapmanız gerekiyor" },
        { status: 401 }
      );
    }

    // Mevcut kullanıcıyı bul
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    console.log("Current User:", currentUser);

    if (!currentUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email } = body;
    console.log("Email to add:", email);

    if (!email) {
      return NextResponse.json(
        { error: "E-posta adresi gerekli" },
        { status: 400 }
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
    console.log("Group:", group);

    if (!group) {
      return NextResponse.json(
        { error: "Grup bulunamadı" },
        { status: 404 }
      );
    }

    // Kullanıcının grup sahibi olup olmadığını kontrol et
    const isOwner = group.ownerId === currentUser.id;
    console.log("Is Owner:", isOwner, "Group Owner ID:", group.ownerId, "Current User ID:", currentUser.id);

    if (!isOwner) {
      return NextResponse.json(
        { error: "Sadece grup sahibi üye ekleyebilir" },
        { status: 403 }
      );
    }

    // Eklenecek kullanıcıyı bul (case-insensitive)
    const userToAdd = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive'
        }
      },
    });
    console.log("User to add:", userToAdd);

    if (!userToAdd) {
      return NextResponse.json(
        { error: `${email} adresine sahip kullanıcı TripSplit'te kayıtlı değil. Kullanıcının önce TripSplit'e kayıt olması gerekiyor.` },
        { status: 404 }
      );
    }

    // Kullanıcının zaten grupta olup olmadığını kontrol et (case-insensitive)
    const isAlreadyMember = group.members.some(
      (member) => member.user.email.toLowerCase() === email.toLowerCase()
    );
    console.log("Is Already Member:", isAlreadyMember);

    if (isAlreadyMember) {
      return NextResponse.json(
        { error: "Bu kullanıcı zaten grubun üyesi" },
        { status: 400 }
      );
    }

    // Kullanıcıyı gruba ekle
    const member = await prisma.UserGroup.create({
      data: {
        groupId: params.groupId,
        userId: userToAdd.id,
      },
      include: {
        user: true,
      },
    });
    console.log("Created Member:", member);

    return NextResponse.json(member);
  } catch (error) {
    console.error("[MEMBERS_POST]", error);
    return NextResponse.json(
      { error: "Bir hata oluştu. Lütfen tekrar deneyin." },
      { status: 500 }
    );
  }
} 