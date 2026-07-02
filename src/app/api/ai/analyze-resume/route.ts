import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { analyzeResumeAI } from "@/lib/ai";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  
  try {
    const { resumeName } = await request.json();
    
    // Retrieve student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    const currentSkills = JSON.parse(studentProfile.skills || "[]");
    
    // Run AI analysis
    const analysis = await analyzeResumeAI(resumeName || "Uploaded Resume", currentSkills);

    // Update database
    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: {
        resumeUrl: `/uploads/${resumeName || "resume.pdf"}`,
        resumeAnalysis: JSON.stringify({
          summary: analysis.summary,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
          score: analysis.score
        }),
        skillGapReport: JSON.stringify({
          gapSkills: analysis.weaknesses,
          actions: analysis.actions
        })
      }
    });

    // Create a notification for the student
    await prisma.notification.create({
      data: {
        userId,
        title: "Resume Analysis Completed",
        message: `Your resume has been parsed successfully! AI score: ${analysis.score}/100. Review your skill gaps in the sidebar.`
      }
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error in AI resume analysis route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
