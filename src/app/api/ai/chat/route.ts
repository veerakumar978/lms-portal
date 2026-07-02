import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { askAICoach } from "@/lib/ai";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Retrieve student profile if the role is student
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId },
      include: { user: true }
    });

    const reply = await askAICoach(message, studentProfile);
    
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error in AI chat route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
