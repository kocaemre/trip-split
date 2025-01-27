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

    const { name } = await req.json();

    if (!name) {
      return new NextResponse("Grup adı gerekli", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return new NextResponse("Kullanıcı bulunamadı", { status: 404 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
          },
        },
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("[GROUPS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 