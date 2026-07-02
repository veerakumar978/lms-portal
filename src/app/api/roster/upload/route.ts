import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "COLLEGE_ADMIN") {
    return NextResponse.json({ error: "Unauthorized. College Admin permissions required." }, { status: 401 });
  }

  try {
    const { csvText } = await request.json();
    if (!csvText) {
      return NextResponse.json({ error: "CSV text is required" }, { status: 400 });
    }

    const lines = csvText.split("\n");
    const header = lines[0].split(",");
    
    // Validate headers
    // Format: name,email,role,cgpa,skills
    let importedCount = 0;
    let duplicateCount = 0;

    // Fetch college/dept/course details to relate
    const college = await prisma.college.findFirst();
    const dept = await prisma.department.findFirst({ where: { collegeId: college?.id } });
    const course = await prisma.course.findFirst({ where: { departmentId: dept?.id } });

    if (!college || !dept || !course) {
      return NextResponse.json({ error: "System must have at least one College, Department, and Course before roster upload." }, { status: 400 });
    }

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(",");
      const name = columns[0]?.trim();
      const email = columns[1]?.trim();
      const roleInput = columns[2]?.trim().toUpperCase(); // STUDENT or FACULTY
      const cgpa = parseFloat(columns[3]?.trim() || "0.0");
      const skillsText = columns[4]?.trim() || "[]";

      if (!name || !email || !roleInput) continue;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        duplicateCount++;
        continue;
      }

      // Create user
      const defaultPassword = roleInput.toLowerCase() + "123";
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: defaultPassword,
          role: roleInput,
        }
      });

      // Create profile depending on role
      if (roleInput === "STUDENT") {
        let skillsArray = [];
        try {
          skillsArray = JSON.parse(skillsText);
        } catch {
          skillsArray = skillsText.split(";").map((s: string) => s.trim()).filter(Boolean);
        }

        await prisma.studentProfile.create({
          data: {
            userId: newUser.id,
            collegeId: college.id,
            departmentId: dept.id,
            courseId: course.id,
            semester: 1,
            cgpa,
            skills: JSON.stringify(skillsArray),
            placementStatus: "UNPLACED",
          }
        });
      } else if (roleInput === "FACULTY") {
        await prisma.facultyProfile.create({
          data: {
            userId: newUser.id,
            departmentId: dept.id,
            designation: "Assistant Professor",
            subjects: JSON.stringify([]),
          }
        });
      }

      importedCount++;
    }

    return NextResponse.json({
      success: true,
      importedCount,
      duplicateCount,
      message: `Successfully imported ${importedCount} records. ${duplicateCount} duplicates skipped.`
    });
  } catch (error) {
    console.error("Error in roster upload:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
