import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: {
        college: true,
        department: true,
        course: true
      }
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Error in GET student profile info:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
