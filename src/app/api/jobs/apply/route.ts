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
    const { jobId } = await request.json();
    
    if (!jobId) {
      return NextResponse.json({ error: "Job ID is required" }, { status: 400 });
    }

    // Retrieve student profile
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    // Retrieve job details to verify CGPA eligibility
    const job = await prisma.jobPosting.findUnique({
      where: { id: jobId },
      include: { company: true }
    });

    if (!job) {
      return NextResponse.json({ error: "Job posting not found" }, { status: 404 });
    }

    if (studentProfile.cgpa < job.eligibilityCgpa) {
      return NextResponse.json({ 
        error: `Ineligible. This drive requires a minimum CGPA of ${job.eligibilityCgpa.toFixed(2)}, yours is ${studentProfile.cgpa.toFixed(2)}.` 
      }, { status: 400 });
    }

    // Check if application already exists
    const existingApp = await prisma.application.findFirst({
      where: {
        studentId: studentProfile.id,
        jobPostingId: jobId
      }
    });

    if (existingApp) {
      return NextResponse.json({ error: "You have already applied for this drive." }, { status: 400 });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        studentId: studentProfile.id,
        jobPostingId: jobId,
        status: "PENDING"
      }
    });

    // Notify placement officer or create audit trail log
    await prisma.notification.create({
      data: {
        userId,
        title: "Application Submitted",
        message: `Your application for ${job.title} at ${job.company.name} was successfully sent.`
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Error in job application submit:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
