import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/login");
  }

  const userId = (session.user as any).id;

  // Retrieve user with role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  });

  if (!user) {
    redirect("/auth/login");
  }

  // Pre-fetch initial dataset depending on role to bootstrap views cleanly
  let initialData: any = {};

  try {
    if (user.role === "STUDENT") {
      const studentProfile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: {
          college: true,
          department: true,
          course: true
        }
      });
      
      if (!studentProfile?.isOnboarded || studentProfile?.verificationStatus !== "APPROVED") {
        redirect("/dashboard/onboarding");
      }
      
      const applications = await prisma.application.findMany({
        where: { studentId: studentProfile?.id },
        include: {
          jobPosting: {
            include: { company: true }
          }
        }
      });

      const activeJobs = await prisma.jobPosting.findMany({
        where: { isActive: true },
        include: { company: true },
        orderBy: { createdAt: "desc" }
      });

      const assessments = await prisma.assessment.findMany({
        include: { questions: true }
      });

      const submissions = await prisma.assessmentSubmission.findMany({
        where: { studentId: studentProfile?.id }
      });

      const surveys = await prisma.survey.findMany({
        include: { questions: true }
      });

      initialData = {
        studentProfile,
        applications,
        activeJobs,
        assessments,
        submissions,
        surveys
      };
    } else if (user.role === "FACULTY") {
      const facultyProfile = await prisma.facultyProfile.findUnique({
        where: { userId },
        include: { department: true }
      });

      const assessmentsCreated = await prisma.assessment.findMany({
        where: { createdById: userId },
        include: { questions: true }
      });

      const studentsList = await prisma.studentProfile.findMany({
        where: { departmentId: facultyProfile?.departmentId },
        include: { user: true }
      });

      initialData = {
        facultyProfile,
        assessmentsCreated,
        studentsList
      };
    } else if (user.role === "COLLEGE_ADMIN") {
      const college = await prisma.college.findFirst();
      const departments = await prisma.department.findMany({
        where: { collegeId: college?.id },
        include: {
          courses: true,
          studentProfiles: true,
          facultyProfiles: true
        }
      });

      const facultyProfiles = await prisma.facultyProfile.findMany({
        where: { department: { collegeId: college?.id } },
        include: { user: true, department: true }
      });

      const studentProfiles = await prisma.studentProfile.findMany({
        where: { collegeId: college?.id },
        include: { user: true, department: true, course: true }
      });

      initialData = {
        college,
        departments,
        facultyProfiles,
        studentProfiles
      };
    } else if (user.role === "PLACEMENT_OFFICER") {
      const jobDrives = await prisma.jobPosting.findMany({
        include: { company: true, applications: true },
        orderBy: { createdAt: "desc" }
      });

      const companies = await prisma.company.findMany();
      
      const studentProfiles = await prisma.studentProfile.findMany({
        include: { user: true, department: true, course: true, applications: true }
      });

      const surveys = await prisma.survey.findMany({
        include: {
          responses: true
        }
      });

      initialData = {
        jobDrives,
        companies,
        studentProfiles,
        surveys
      };
    } else if (user.role === "EMPLOYER" || user.role === "RECRUITER") {
      const company = await prisma.company.findFirst();
      const jobPostings = await prisma.jobPosting.findMany({
        where: { companyId: company?.id },
        include: {
          applications: {
            include: {
              student: {
                include: { user: true, course: true }
              }
            }
          }
        }
      });

      initialData = {
        company,
        jobPostings
      };
    } else if (user.role === "AGENCY") {
      const batches = await prisma.agencyBatch.findMany({
        where: { agencyUserId: userId }
      });

      initialData = {
        batches
      };
    } else if (user.role === "SUPER_ADMIN") {
      const colleges = await prisma.college.findMany({
        include: {
          departments: true,
          studentProfiles: true
        }
      });

      const totalUsers = await prisma.user.count();
      const totalJobs = await prisma.jobPosting.count();
      const totalApplications = await prisma.application.count();

      initialData = {
        colleges,
        totalUsers,
        totalJobs,
        totalApplications
      };
    }
  } catch (error) {
    console.error("Error pre-fetching dashboard dataset:", error);
  }

  return (
    <DashboardClient 
      initialData={initialData} 
      role={user.role} 
      user={user} 
    />
  );
}
