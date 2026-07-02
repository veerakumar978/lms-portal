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
    const { assessmentId, answers } = await request.json(); // answers is { [questionId]: "A" | "B" | "C" | "D" }
    
    if (!assessmentId || !answers) {
      return NextResponse.json({ error: "Assessment ID and answers are required" }, { status: 400 });
    }

    // Get student profile
    const student = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!student) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Fetch assessment questions to grade
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { questions: true }
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // Auto grading
    let correctCount = 0;
    const questions = assessment.questions;
    
    questions.forEach((q) => {
      const selected = answers[q.id];
      if (selected === q.correctOption) {
        correctCount++;
      }
    });

    const score = correctCount;
    const maxScore = questions.length;

    // Create submission record
    const submission = await prisma.assessmentSubmission.create({
      data: {
        assessmentId,
        studentId: student.id,
        score,
        maxScore,
        answers: JSON.stringify(answers),
      }
    });

    // Notify student of grading success
    await prisma.notification.create({
      data: {
        userId,
        title: "Assessment Graded",
        message: `You completed "${assessment.title}". Scored: ${score}/${maxScore} (${Math.round((score / maxScore) * 100)}%).`
      }
    });

    return NextResponse.json({
      success: true,
      score,
      maxScore,
      submissionId: submission.id
    });
  } catch (error) {
    console.error("Error grading assessment submission:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
