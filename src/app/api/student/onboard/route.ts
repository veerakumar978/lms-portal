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
    const body = await request.json();
    const { step } = body;

    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId }
    });

    if (!studentProfile) {
      return NextResponse.json({ error: "Student profile not found" }, { status: 404 });
    }

    let updatedData: any = {};

    if (step === 1) {
      const { address, careerInterests, skills } = body;
      updatedData = {
        address,
        careerInterests: JSON.stringify(careerInterests || []),
        skills: JSON.stringify(skills || []),
        onboardingStep: 2
      };
    } else if (step === 2) {
      const { resumeName, aadhaarName, certificatesNames } = body;
      updatedData = {
        resumeUrl: resumeName ? `/uploads/${resumeName}` : studentProfile.resumeUrl,
        aadhaarUrl: aadhaarName ? `/uploads/${aadhaarName}` : studentProfile.aadhaarUrl,
        certificatesUrls: JSON.stringify(certificatesNames || []),
        onboardingStep: 3
      };
    } else if (step === 3) {
      const { answers, scores } = body;
      updatedData = {
        varkAnswers: JSON.stringify(answers || {}),
        varkScores: JSON.stringify(scores || {}),
        onboardingStep: 4,
        verificationStatus: "PENDING"
      };
    } else if (step === 4) {
      // Mock Bypass/Approval trigger to complete onboarding
      const { approve } = body;
      if (approve) {
        updatedData = {
          isOnboarded: true,
          verificationStatus: "APPROVED"
        };
        
        // Notify student of approval
        await prisma.notification.create({
          data: {
            userId,
            title: "Account Profile Approved",
            message: "Congratulations! Your student profile has been verified and approved by the placement cell."
          }
        });
      }
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { userId },
      data: updatedData
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Error in student onboarding API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
