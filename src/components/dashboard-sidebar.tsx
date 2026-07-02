"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Users, 
  GraduationCap, 
  BarChart3, 
  FileSpreadsheet, 
  MessageSquare, 
  ClipboardList, 
  Settings, 
  LogOut, 
  School, 
  Building,
  Award,
  BookOpenCheck
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
};

export default function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const role = session?.user && (session.user as any).role;
  const userName = session?.user?.name || "Guest User";

  // Build links based on role
  const getNavItems = (): NavItem[] => {
    switch (role) {
      case "SUPER_ADMIN":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Colleges", href: "/dashboard?tab=colleges", icon: School },
          { label: "User Management", href: "/dashboard?tab=users", icon: Users },
          { label: "Placement Reports", href: "/dashboard?tab=placements", icon: BarChart3 },
          { label: "System Settings", href: "/dashboard?tab=settings", icon: Settings },
        ];
      case "COLLEGE_ADMIN":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Upload Roster", href: "/dashboard?tab=roster", icon: FileSpreadsheet },
          { label: "Departments", href: "/dashboard?tab=departments", icon: School },
          { label: "Faculty", href: "/dashboard?tab=faculty", icon: GraduationCap },
          { label: "Students", href: "/dashboard?tab=students", icon: Users },
        ];
      case "PLACEMENT_OFFICER":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Job Drives", href: "/dashboard?tab=drives", icon: Briefcase },
          { label: "Student Eligibility", href: "/dashboard?tab=eligibility", icon: BookOpenCheck },
          { label: "Employability Surveys", href: "/dashboard?tab=surveys", icon: ClipboardList },
          { label: "Placement Statistics", href: "/dashboard?tab=stats", icon: BarChart3 },
        ];
      case "FACULTY":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Course Builder", href: "/dashboard?tab=courses", icon: BookOpen },
          { label: "Attendance Tracker", href: "/dashboard?tab=attendance", icon: Users },
          { label: "Assessments", href: "/dashboard?tab=assessments", icon: ClipboardList },
          { label: "Feedback System", href: "/dashboard?tab=feedback", icon: MessageSquare },
        ];
      case "AGENCY":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Training Batches", href: "/dashboard?tab=batches", icon: BookOpen },
          { label: "Trainer Allocation", href: "/dashboard?tab=trainers", icon: GraduationCap },
          { label: "Milestone Tracking", href: "/dashboard?tab=milestones", icon: Award },
        ];
      case "RECRUITER":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Talent Search", href: "/dashboard?tab=talent", icon: Users },
          { label: "Interview Scheduler", href: "/dashboard?tab=interviews", icon: ClipboardList },
          { label: "Offer Outbox", href: "/dashboard?tab=offers", icon: Award },
        ];
      case "EMPLOYER":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Active Jobs", href: "/dashboard?tab=jobs", icon: Briefcase },
          { label: "Applicant Tracking", href: "/dashboard?tab=applicants", icon: Users },
          { label: "Company Profile", href: "/dashboard?tab=profile", icon: Building },
        ];
      case "STUDENT":
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Placement Hub", href: "/dashboard?tab=placements", icon: Briefcase },
          { label: "AI Career Coach", href: "/dashboard?tab=aicoach", icon: MessageSquare },
          { label: "Skill-Gap Analyzer", href: "/dashboard?tab=skillgap", icon: BarChart3 },
          { label: "Assessments & Tests", href: "/dashboard?tab=assessments", icon: ClipboardList },
        ];
      default:
        return [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ];
    }
  };

  const navItems = getNavItems();

  const getRoleLabel = (r: string | undefined) => {
    if (!r) return "Guest";
    return r.replace("_", " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border gap-3">
        <img src="/logo.png" alt="MATHA Logo" className="h-8 w-auto object-contain" />
        <div>
          <span className="font-bold text-sm bg-gradient-to-r from-indigo-500 to-amber-500 bg-clip-text text-transparent">
            MATHA AI
          </span>
          <span className="text-[10px] block text-muted-foreground font-medium -mt-1">
            LMS & Portal
          </span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href.split('?')[0]) && item.href !== '/dashboard');
          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Footer Profile */}
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow">
            {userName.charAt(0)}
          </div>
          <div className="truncate flex-1">
            <span className="block text-sm font-semibold text-foreground truncate">
              {userName}
            </span>
            <span className="inline-block px-2 py-0.5 mt-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 uppercase tracking-wide">
              {getRoleLabel(role)}
            </span>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
