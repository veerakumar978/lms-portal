import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any;
  
  if (!session?.user || (user.role !== "PLACEMENT_OFFICER" && user.role !== "EMPLOYER" && user.role !== "RECRUITER")) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { title, description, requirements, packageSalary, location, eligibilityCgpa, deadline } = await request.json();

    if (!title || !description || !requirements || !packageSalary || !deadline) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Get company ID (either employer's company or first company for placement officer)
    let companyId;
    if (user.role === "EMPLOYER" || user.role === "RECRUITER") {
      const cmp = await prisma.company.findFirst(); // Or find specific if mapped
      companyId = cmp?.id;
    } else {
      // PLACEMENT_OFFICER can select or default to first company
      const cmp = await prisma.company.findFirst();
      companyId = cmp?.id;
    }

    if (!companyId) {
      // Create a default company if none exists
      const newCmp = await prisma.company.create({
        data: {
          name: "Corporate Partner",
          website: "https://example.com",
          industry: "Technology",
        }
      });
      companyId = newCmp.id;
    }

    const job = await prisma.jobPosting.create({
      data: {
        companyId,
        title,
        description,
        requirements: JSON.stringify(requirements.split(",").map((s: string) => s.trim())),
        packageSalary: parseFloat(packageSalary),
        location,
        eligibilityCgpa: parseFloat(eligibilityCgpa) || 0.0,
        deadline: new Date(deadline),
        isActive: true,
      }
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("Error creating job posting:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
