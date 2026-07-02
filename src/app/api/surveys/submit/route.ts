import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized. Students only." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { surveyId, answers } = await request.json(); // answers is JSON string or object
    
    if (!surveyId || !answers) {
      return NextResponse.json({ error: "Survey ID and answers are required" }, { status: 400 });
    }

    const student = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Create survey response record
    const response = await prisma.surveyResponse.create({
      data: {
        surveyId,
        studentId: student.id,
        answers: typeof answers === "string" ? answers : JSON.stringify(answers)
      }
    });

    return NextResponse.json({ success: true, responseId: response.id });
  } catch (error) {
    console.error("Error in survey submit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
