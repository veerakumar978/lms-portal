import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./database/lms.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Clearing existing database data...');
  await prisma.notification.deleteMany().catch(() => {});
  await prisma.feedback.deleteMany().catch(() => {});
  await prisma.assessmentSubmission.deleteMany().catch(() => {});
  await prisma.assessmentQuestion.deleteMany().catch(() => {});
  await prisma.assessment.deleteMany().catch(() => {});
  await prisma.surveyResponse.deleteMany().catch(() => {});
  await prisma.surveyQuestion.deleteMany().catch(() => {});
  await prisma.survey.deleteMany().catch(() => {});
  await prisma.agencyBatch.deleteMany().catch(() => {});
  await prisma.application.deleteMany().catch(() => {});
  await prisma.jobPosting.deleteMany().catch(() => {});
  await prisma.company.deleteMany().catch(() => {});
  await prisma.facultyProfile.deleteMany().catch(() => {});
  await prisma.studentProfile.deleteMany().catch(() => {});
  await prisma.semester.deleteMany().catch(() => {});
  await prisma.course.deleteMany().catch(() => {});
  await prisma.department.deleteMany().catch(() => {});
  await prisma.college.deleteMany().catch(() => {});
  await prisma.user.deleteMany().catch(() => {});

  console.log('Seeding baseline college data...');
  
  // 1. Colleges
  const nitCollege = await prisma.college.create({
    data: {
      name: 'MATHA Institute of Technology',
      code: 'MATHA',
    },
  });

  // 2. Departments
  const cseDept = await prisma.department.create({
    data: {
      name: 'Computer Science and Engineering',
      collegeId: nitCollege.id,
    },
  });

  const eceDept = await prisma.department.create({
    data: {
      name: 'Electronics and Communication',
      collegeId: nitCollege.id,
    },
  });

  // 3. Courses
  const cseCourse = await prisma.course.create({
    data: {
      name: 'B.Tech Computer Science',
      code: 'CS-BTECH',
      departmentId: cseDept.id,
    },
  });

  const eceCourse = await prisma.course.create({
    data: {
      name: 'B.Tech Electronics',
      code: 'EC-BTECH',
      departmentId: eceDept.id,
    },
  });

  // 4. Semesters
  for (let i = 1; i <= 8; i++) {
    await prisma.semester.create({
      data: {
        number: i,
        courseId: cseCourse.id,
      },
    });
    await prisma.semester.create({
      data: {
        number: i,
        courseId: eceCourse.id,
      },
    });
  }

  console.log('Seeding user profiles for all 8 roles...');

  // 5. Users
  // Super Admin
  const superAdmin = await prisma.user.create({
    data: {
      email: 'admin@matha.edu',
      name: 'MATHA Admin',
      password: 'admin123', // plain text for easy prototype logins
      role: 'SUPER_ADMIN',
    },
  });

  // College Admin
  const collegeAdmin = await prisma.user.create({
    data: {
      email: 'college@matha.edu',
      name: 'Dr. Sarah Jenkins',
      password: 'college123',
      role: 'COLLEGE_ADMIN',
    },
  });

  // Placement Officer
  const placementOfficer = await prisma.user.create({
    data: {
      email: 'placement@matha.edu',
      name: 'Prof. Rajesh Kumar',
      password: 'placement123',
      role: 'PLACEMENT_OFFICER',
    },
  });

  // Faculty
  const faculty = await prisma.user.create({
    data: {
      email: 'faculty@matha.edu',
      name: 'Dr. Alan Turing',
      password: 'faculty123',
      role: 'FACULTY',
    },
  });

  await prisma.facultyProfile.create({
    data: {
      userId: faculty.id,
      departmentId: cseDept.id,
      designation: 'Professor',
      subjects: JSON.stringify(['Database Systems', 'Algorithms', 'Software Engineering']),
    },
  });

  // Training Agency
  const agency = await prisma.user.create({
    data: {
      email: 'agency@matha.edu',
      name: 'SkillsUP Academy',
      password: 'agency123',
      role: 'AGENCY',
    },
  });

  // Recruiter
  const recruiter = await prisma.user.create({
    data: {
      email: 'recruiter@google.com',
      name: 'Sundar Pichai',
      password: 'recruiter123',
      role: 'RECRUITER',
    },
  });

  // Employer
  const employer = await prisma.user.create({
    data: {
      email: 'employer@google.com',
      name: 'Google Placement Team',
      password: 'employer123',
      role: 'EMPLOYER',
    },
  });

  // Student (Satya Alugolu)
  const student = await prisma.user.create({
    data: {
      email: 'student@matha.edu',
      name: 'Satya Alugolu',
      password: 'student123',
      role: 'STUDENT',
    },
  });

  const studentProfile = await prisma.studentProfile.create({
    data: {
      userId: student.id,
      collegeId: nitCollege.id,
      departmentId: cseDept.id,
      courseId: cseCourse.id,
      semester: 6,
      cgpa: 8.5,
      skills: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Python', 'CSS']),
      resumeUrl: '/uploads/sample_resume.pdf',
      resumeAnalysis: JSON.stringify({
        summary: 'Strong foundational web development skills with good programming logic. Projects demonstrate familiarity with front-end React apps and API endpoints.',
        strengths: ['JavaScript/TypeScript', 'React framework', 'Node.js backend design', 'Python scripting'],
        weaknesses: ['Cloud infrastructure', 'System design experience', 'Docker & Kubernetes'],
        recommendedRoles: ['Frontend Engineer', 'Fullstack Developer', 'Software Engineer Associate'],
      }),
      skillGapReport: JSON.stringify({
        gapSkills: ['Docker', 'AWS (S3/EC2)', 'GraphQL', 'System Design'],
        actions: [
          'Take a basic Docker containerization course.',
          'Complete a sample project deploying a Node/React app to AWS.',
          'Read up on REST vs GraphQL API designs.',
        ],
      }),
      placementStatus: 'UNPLACED',
    },
  });

  console.log('Seeding placement and company details...');

  // 6. Companies & Jobs
  const google = await prisma.company.create({
    data: {
      name: 'Google LLC',
      website: 'https://careers.google.com',
      industry: 'Technology',
    },
  });

  const microsoft = await prisma.company.create({
    data: {
      name: 'Microsoft Corp',
      website: 'https://careers.microsoft.com',
      industry: 'Technology',
    },
  });

  const meta = await prisma.company.create({
    data: {
      name: 'Meta Platforms Inc',
      website: 'https://careers.meta.com',
      industry: 'Social Media',
    },
  });

  // Job postings
  const googleJob = await prisma.jobPosting.create({
    data: {
      companyId: google.id,
      title: 'Associate Software Engineer',
      description: 'Join the Google core engineering team working on search and cloud infrastructure APIs. Requires solid knowledge of algorithms, data structures, and system design.',
      requirements: JSON.stringify(['React', 'Node.js', 'Algorithms', 'Python']),
      packageSalary: 22.5,
      location: 'Bangalore, India',
      eligibilityCgpa: 8.0,
      deadline: new Date('2026-08-30'),
      isActive: true,
    },
  });

  const msJob = await prisma.jobPosting.create({
    data: {
      companyId: microsoft.id,
      title: 'Frontend Developer',
      description: 'Build premium web applications and user interfaces using React, TypeScript, and modern styling libraries. Optimize client performance and accessibility.',
      requirements: JSON.stringify(['React', 'TypeScript', 'CSS', 'Tailwind CSS']),
      packageSalary: 18.0,
      location: 'Hyderabad, India',
      eligibilityCgpa: 7.5,
      deadline: new Date('2026-07-25'),
      isActive: true,
    },
  });

  const metaJob = await prisma.jobPosting.create({
    data: {
      companyId: meta.id,
      title: 'Data Analyst',
      description: 'Help product groups define metrics and make data-driven decisions. Experience with Python, Pandas, SQL, and data visualization tools required.',
      requirements: JSON.stringify(['Python', 'SQL', 'Pandas', 'Data Visualization']),
      packageSalary: 16.5,
      location: 'Remote, India',
      eligibilityCgpa: 8.0,
      deadline: new Date('2026-07-15'),
      isActive: true,
    },
  });

  console.log('Seeding student applications...');
  
  // Applications
  await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobPostingId: msJob.id,
      status: 'SHORTLISTED',
      interviewDate: new Date('2026-07-10T10:00:00Z'),
      feedback: 'Excellent response in frontend coding round. Scheduled for final technical interview.',
    },
  });

  await prisma.application.create({
    data: {
      studentId: studentProfile.id,
      jobPostingId: googleJob.id,
      status: 'PENDING',
    },
  });

  console.log('Seeding training batches...');

  // Agency batches
  await prisma.agencyBatch.create({
    data: {
      agencyUserId: agency.id,
      name: 'Web Dev Mastery - Batch A',
      trainerName: 'John Doe',
      skills: JSON.stringify(['React', 'Next.js', 'Tailwind CSS']),
      status: 'ACTIVE',
      progress: 65.0,
      startDate: new Date('2026-05-01'),
      endDate: new Date('2026-08-01'),
    },
  });

  await prisma.agencyBatch.create({
    data: {
      agencyUserId: agency.id,
      name: 'Python for AI & ML',
      trainerName: 'Jane Smith',
      skills: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow']),
      status: 'ACTIVE',
      progress: 35.0,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-09-01'),
    },
  });

  console.log('Seeding assessments...');

  // Assessments
  const assessment = await prisma.assessment.create({
    data: {
      title: 'Full-Stack Web Dev MCQ Quiz',
      description: 'Assess student knowledge in modern frontend development, backend APIs, and database transactions.',
      durationMinutes: 20,
      createdById: faculty.id,
    },
  });

  await prisma.assessmentQuestion.create({
    data: {
      assessmentId: assessment.id,
      questionText: 'Which React hook is used to perform side effects in functional components?',
      optionA: 'useState',
      optionB: 'useEffect',
      optionC: 'useContext',
      optionD: 'useReducer',
      correctOption: 'B',
    },
  });

  await prisma.assessmentQuestion.create({
    data: {
      assessmentId: assessment.id,
      questionText: 'What is the purpose of Prisma migrations?',
      optionA: 'To compile JS files to TypeScript',
      optionB: 'To build a Next.js production bundle',
      optionC: 'To keep database schema in sync with Prisma schema',
      optionD: 'To cache database queries in memory',
      correctOption: 'C',
    },
  });

  await prisma.assessmentQuestion.create({
    data: {
      assessmentId: assessment.id,
      questionText: 'Which CSS property is used to create a glassmorphism blur effect in Tailwind CSS?',
      optionA: 'filter: blur()',
      optionB: 'backdrop-filter: blur()',
      optionC: 'mix-blend-mode',
      optionD: 'opacity',
      correctOption: 'B',
    },
  });

  console.log('Seeding feedback & notifications...');

  // Feedback
  await prisma.feedback.create({
    data: {
      fromUserId: faculty.id,
      toUserId: student.id,
      content: 'Satya has been outstanding in SQL and Database Labs. Shows great problem solving abilities.',
      rating: 5,
      category: 'FACULTY_TO_STUDENT',
    },
  });

  // Notifications
  await prisma.notification.create({
    data: {
      userId: student.id,
      title: 'Interview Shortlist Alert',
      message: 'Congratulations! You have been shortlisted for Microsoft\'s Frontend Developer drive. Interview is scheduled for July 10 at 10 AM.',
    },
  });

  await prisma.notification.create({
    data: {
      userId: student.id,
      title: 'New Assessment Added',
      message: 'Dr. Alan Turing has uploaded the Full-Stack Web Dev MCQ Quiz. Complete it by July 5.',
    },
  });

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
