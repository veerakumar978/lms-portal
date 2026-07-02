import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "path";
import fs from "fs";

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "PRESENT" : "MISSING",
      DATABASE_URL: process.env.DATABASE_URL || "MISSING",
    },
    cwd: process.cwd(),
  };

  // 1. Resolve DB Path
  try {
    const dbPath = path.resolve(process.cwd(), "database", "lms.db");
    diagnostics.resolvedDbPath = dbPath;
    diagnostics.dbFolderExists = fs.existsSync(path.dirname(dbPath));
    diagnostics.dbFileExists = fs.existsSync(dbPath);
    if (diagnostics.dbFileExists) {
      diagnostics.dbFileSize = fs.statSync(dbPath).size;
    }
  } catch (err: any) {
    diagnostics.dbPathError = err.message;
  }

  // 2. Query Prisma
  try {
    const usersCount = await prisma.user.count();
    diagnostics.databaseConnection = "SUCCESS";
    diagnostics.usersCount = usersCount;
    if (usersCount > 0) {
      const sampleUsers = await prisma.user.findMany({
        take: 3,
        select: {
          email: true,
          role: true,
          name: true,
        }
      });
      diagnostics.sampleUsers = sampleUsers;
    } else {
      diagnostics.sampleUsers = [];
    }
  } catch (err: any) {
    diagnostics.databaseConnection = "FAILED";
    diagnostics.databaseError = err.message;
  }

  return NextResponse.json(diagnostics);
}
