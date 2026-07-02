// AI Service client for MATHA LMS
import { prisma } from "@/lib/prisma";

export async function askAICoach(message: string, studentProfile: any) {
  // If OpenAI API key is set
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are MATHA AI Career Coach, a professional mentor for students. Help them prepare for interviews, recommend learning courses, and advise on skill-gap resolution. Student Profile: ${JSON.stringify(
                studentProfile
              )}`
            },
            { role: "user", content: message }
          ],
          temperature: 0.7,
        }),
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      console.error("OpenAI call failed, running fallback:", e);
    }
  }

  // If Ollama endpoint is configured
  if (process.env.OLLAMA_API_URL) {
    try {
      const response = await fetch(`${process.env.OLLAMA_API_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3",
          prompt: `You are MATHA AI Career Coach. Help the student prepare for interviews and career goals. Message: ${message}. Student details: ${JSON.stringify(
            studentProfile
          )}`,
          stream: false,
        }),
      });
      const data = await response.json();
      return data.response;
    } catch (e) {
      console.error("Ollama call failed, running fallback:", e);
    }
  }

  // High quality mock fallback simulation based on keywords
  const msgLower = message.toLowerCase();
  const studentName = studentProfile?.user?.name || "Student";
  const currentSkills = studentProfile?.skills ? JSON.parse(studentProfile.skills) : [];

  if (msgLower.includes("interview") || msgLower.includes("question") || msgLower.includes("prep")) {
    return `Hello ${studentName}! Let's do a quick mock interview prep for a Software Engineer role. 
    
Here is a technical question based on your skills in **${currentSkills.slice(0, 3).join(", ")}**:

*\"Can you explain the difference between client-side rendering (CSR) and server-side rendering (SSR) in Next.js, and when you would choose one over the other?\"*

Take a moment to formulate your answer, and reply back to me when you're ready!`;
  }

  if (msgLower.includes("resume") || msgLower.includes("portfolio")) {
    return `Hi ${studentName}, analyzing your profile, your resume is in good shape with a solid CGPA of **${studentProfile?.cgpa || 8.5}**. 

To stand out to recruiters, I recommend adding:
1. A direct production link to a deployed project.
2. Under your skills section, group them clearly: *Frontend* (React, Tailwind), *Backend* (Node.js, databases), and *Tools* (Git, Docker).
3. Quantify achievements (e.g. "Reduced API load times by 20%").`;
  }

  if (msgLower.includes("gap") || msgLower.includes("skill") || msgLower.includes("learn")) {
    return `Based on your course requirements and placements at top companies, you have a solid foundation in **${currentSkills.join(
      ", "
    )}**. 
    
However, you have gaps in **Docker, AWS deployments, and System Design concepts**. I recommend:
- Completing a 5-hour course on containerization.
- Reading up on REST API vs GraphQL architectures.
- Practicing basic DB scaling concepts.`;
  }

  return `Hello ${studentName}! I am your MATHA AI Career Coach. I can help you:
- Prepare for upcoming mock interviews.
- Analyze your resume for corporate drive eligibility.
- Detect skill gaps and get personalized study roadmaps.

What career target or subject questions can I assist you with today?`;
}

export async function analyzeResumeAI(resumeContent: string, currentSkills: string[]) {
  // Simulates AI parsing of resume content and mapping it against industry standard keywords
  const skillsDetected = ["React", "TypeScript", "Node.js", "Python", "SQL", "Tailwind CSS"];
  const missingSkills = ["Docker", "AWS S3", "System Design", "GraphQL"];
  
  const score = Math.floor(65 + Math.random() * 25); // Score between 65 and 90

  return {
    score,
    summary: "The resume demonstrates robust practical knowledge of fullstack web environments. Excellent React and TypeScript experience. Requires additional cloud and DevOps exposure.",
    strengths: skillsDetected.filter(s => currentSkills.includes(s) || Math.random() > 0.4),
    weaknesses: missingSkills,
    actions: [
      "Containerize your fullstack projects using Docker.",
      "Deploy a sample API microservice on AWS EC2 or Vercel.",
      "Explore indexing strategies to optimize database transactions."
    ]
  };
}

export function predictPlacementAI(studentProfile: any, activeJobs: any[]) {
  const cgpa = studentProfile?.cgpa || 7.0;
  const skills = studentProfile?.skills ? JSON.parse(studentProfile.skills) : [];
  
  // Basic prediction heuristic
  let score = 50;
  if (cgpa > 8.5) score += 20;
  else if (cgpa > 7.5) score += 10;

  if (skills.length > 5) score += 15;
  if (skills.includes("React") || skills.includes("Node.js")) score += 10;
  
  // Cap score at 98%
  score = Math.min(score, 98);
  
  let insight = "Your placement chances are average. Boost your profile by undertaking training assessments and picking up core backend skills.";
  if (score > 85) {
    insight = "Excellent profile! Your CGPA and current stack strongly match job listings for software engineering roles.";
  } else if (score > 70) {
    insight = "Solid profile. We recommend taking more assessments and resolving minor skill gaps to secure premium offers.";
  }

  return {
    score,
    insight,
    matchingJobsCount: activeJobs.filter(job => {
      const reqs = JSON.parse(job.requirements || "[]");
      const matchRate = reqs.filter((r: string) => skills.includes(r)).length / reqs.length;
      return cgpa >= job.eligibilityCgpa && matchRate >= 0.5;
    }).length
  };
}
