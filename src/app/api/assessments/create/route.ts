import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "FACULTY") {
    return NextResponse.json({ error: "Unauthorized. Faculty only." }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const { title, description, durationMinutes, questions } = await request.json();

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Title and at least one question is required." }, { status: 400 });
    }

    // Create the assessment and questions in a transaction
    const newAssessment = await prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.create({
        data: {
          title,
          description: description || "",
          durationMinutes: parseInt(durationMinutes) || 30,
          createdById: userId,
        },
      });

      // Create all questions
      for (const q of questions) {
        await tx.assessmentQuestion.create({
          data: {
            assessmentId: assessment.id,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
          },
        });
      }

      return assessment;
    });

    return NextResponse.json({ success: true, assessment: newAssessment });
  } catch (error) {
    console.error("Error creating assessment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
