"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  GraduationCap, 
  Briefcase, 
  TrendingUp, 
  CheckCircle,
  School,
  Moon,
  Sun,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  BookOpen,
  Users,
  Award,
  Bookmark,
  Monitor,
  ExternalLink,
  ChevronDown,
  Play,
  FileText,
  Clock,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";
import { useTheme } from "@/components/providers";

// ==========================================
// DATA STRUCTS
// ==========================================
const COURSES = [
  {
    title: "Sewing Machine Operator",
    category: "Garment & Textile",
    duration: "12 Weeks",
    employability: "92/100",
    placement: "Active Direct",
    desc: "Master sewing machine operations, dress making layouts, design cutting, and textile sorting specifications."
  },
  {
    title: "General Duty Assistant",
    category: "Healthcare Services",
    duration: "16 Weeks",
    employability: "94/100",
    placement: "Hospitals Tie-ups",
    desc: "Develop nursing assistant capabilities, vital checks, client hygiene care, and emergency response basics."
  },
  {
    title: "Retail Sales Associate",
    category: "Sales & Marketing",
    duration: "10 Weeks",
    employability: "89/100",
    placement: "Direct Corporate",
    desc: "Acquire retail customer servicing skills, store billing systems, logistics, and visual merchandising."
  },
  {
    title: "Solar PV Installer (Suryamitra)",
    category: "Renewable Energy",
    duration: "12 Weeks",
    employability: "95/100",
    placement: "Solar Agencies",
    desc: "Comprehensive Suryamitra curriculum. Learn panel installations, grid connectors, testing, and inverter repairs."
  },
  {
    title: "Assistant Beauty Therapist",
    category: "Wellness & Beauty",
    duration: "10 Weeks",
    employability: "88/100",
    placement: "Self-Employment Hub",
    desc: "Acquire aesthetic beauty therapy procedures, skin consultations, styling details, and salon setups."
  },
  {
    title: "Junior Software Developer",
    category: "Information Technology",
    duration: "24 Weeks",
    employability: "96/100",
    placement: "IT Placement Drives",
    desc: "Learn core software structures, logic grids, python databases, HTML/CSS styles, and version controls."
  },
  {
    title: "Field Technician Computing & Peripherals",
    category: "Hardware Engineering",
    duration: "12 Weeks",
    employability: "91/100",
    placement: "Electronics Centers",
    desc: "Diagnose system motherboards, peripheral cards installations, OS setups, and hardware diagnostics."
  },
  {
    title: "Emergency Medical Technician",
    category: "Healthcare Services",
    duration: "20 Weeks",
    employability: "95/100",
    placement: "Trauma Care Units",
    desc: "Advanced first-aid systems, ambulance operations, patient transport safety, and critical trauma actions."
  },
  {
    title: "Front Office Associate",
    category: "Hospitality Services",
    duration: "12 Weeks",
    employability: "90/100",
    placement: "Hotel & Corporate",
    desc: "Develop customer desk operations, phone etiquettes, email logs, visitor registries, and database entries."
  }
];

const TESTIMONIALS = [
  {
    name: "Prasanna Kumar K",
    outcome: "Placed as Sales Promoter at Samsung",
    text: "Thanks to the Retail Sales curriculum at Matha, I gained the professional expertise and confidence required to clear my Samsung interview rounds.",
    tag: "Samsung"
  },
  {
    name: "Deena",
    outcome: "Field Technician - AC & Refrigeration (Voltas Service Center)",
    text: "The hardware and AC systems repair workshop gave me hands-on confidence. I am now working full-time at the Voltas Service Center.",
    tag: "Voltas"
  },
  {
    name: "K Chinna Obuleshu",
    outcome: "Placed at Reliance Trends",
    text: "Matha's corporate career fair gave me direct access to Reliance HR recruiters. The mock interviews prepared me perfectly.",
    tag: "Reliance"
  },
  {
    name: "M Nageswari",
    outcome: "DDU-GKY Success Story",
    text: "The free DDU-GKY vocational courses at Matha changed my life. I went from having no computer skills to earning a stable livelihood.",
    tag: "DDU-GKY"
  },
  {
    name: "Sadaq Ali Khan",
    outcome: "Placed as Pharmacy Assistant",
    text: "The Healthcare GDA training modules gave me solid knowledge about emergency drugs and medical support protocols.",
    tag: "Healthcare"
  },
  {
    name: "Mohammed Mustafa",
    outcome: "Placed through Career Fair",
    text: "I attended the Secunderabad recruitment summit organized by Matha Trust, and secured an spot offer with an IT solutions agency.",
    tag: "Career Fair"
  }
];

export default function PublicHome() {
  const { theme, setTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Carousel states
  const [courseIdx, setCourseIdx] = useState(0);
  const [testimIdx, setTestimIdx] = useState(0);

  // Accessibility parameters: Reduced Motion Option & Animation Toggle
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Video viewer states
  const [videoModal, setVideoModal] = useState<string | null>(null);

  // Contact form states
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [success, setSuccess] = useState("");

  // Detect browser Reduced Motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setAnimationsEnabled(false);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setAnimationsEnabled(!e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Autoplay for Testimonial Slider
  useEffect(() => {
    if (!animationsEnabled) return;
    const timer = setInterval(() => {
      setTestimIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [animationsEnabled]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Thank you! Your message was submitted successfully to Matha Educational Society.");
    setContactName("");
    setContactEmail("");
    setContactMsg("");
    setTimeout(() => setSuccess(""), 4000);
  };

  const MEGA_MENUS: Record<string, { label: string; url: string; desc: string; icon: any }[]> = {
    about: [
      { label: "Organization", url: "#about", desc: "Overview of Matha Trust history since 2008.", icon: Award },
      { label: "Our Team", url: "#about", desc: "Meet the executive board and institutional leaders.", icon: Users },
      { label: "Affiliations", url: "#about", desc: "Governing affiliations and academic accreditations.", icon: Bookmark },
      { label: "Memberships", url: "#about", desc: "Corporate bodies and international memberships.", icon: CheckCircle },
      { label: "Awards", url: "#awards", desc: "Andhra Pradesh Best Training Partner awards.", icon: Sparkles }
    ],
    services: [
      { label: "Skill Development", url: "#services", desc: "Sewing, Solar, Retail, and IT tracks.", icon: Cpu },
      { label: "Competitive Coaching", url: "#services", desc: "Logical math, vocabulary, and mock assessments.", icon: BookOpen },
      { label: "Global Certification", url: "#services", desc: "Industry certifications recognized worldwide.", icon: GraduationCap },
      { label: "Career Fair", url: "#placements", desc: "Job fairs, interviews, and recruitment opportunities.", icon: Briefcase }
    ],
    partners: [
      { label: "Industry Partners", url: "#placements", desc: "Samsung, Voltas, Reliance Trends, etc.", icon: Briefcase },
      { label: "Project Partners", url: "#about", desc: "Collaborators for real-time applications.", icon: Cpu },
      { label: "Academic Alliances", url: "#about", desc: "Affiliated universities and colleges.", icon: GraduationCap },
      { label: "CSR Partners", url: "#about", desc: "Empowering career drives via CSR investments.", icon: Award }
    ],
    student: [
      { label: "Courses", url: "#courses", desc: "Explore coding and analytics pathways.", icon: BookOpen },
      { label: "Student Login", url: "/auth/login", desc: "Access the matha.edu portal dashboard.", icon: Users },
      { label: "Online Exams", url: "/auth/login", desc: "Take mock quizzes and VARK learning reviews.", icon: FileText },
      { label: "Certificate Verification", url: "/auth/login", desc: "Verify course completion hash codes.", icon: CheckCircle },
      { label: "Testimonials", url: "#testimonials", desc: "Success outcomes of graduated candidates.", icon: Sparkles }
    ],
    media: [
      { label: "Press Releases", url: "#about", desc: "Recent news and education summits announcements.", icon: FileText },
      { label: "Photo Gallery", url: "#about", desc: "Summit events and bootcamp pictures.", icon: Monitor },
      { label: "Video Gallery", url: "#about", desc: "Placement interviews and student success clips.", icon: Play }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden flex flex-col scroll-smooth">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 dark:bg-indigo-600/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 dark:bg-purple-600/5 blur-[130px] pointer-events-none z-0" />
      <div className="absolute bottom-[15%] left-[5%] w-[45%] h-[45%] rounded-full bg-amber-600/5 dark:bg-amber-600/2 blur-[130px] pointer-events-none z-0" />

      {/* Transparent Sticky Glass Navbar */}
      <header className="w-full h-20 px-8 flex items-center justify-between glass sticky top-0 z-50 border-b border-slate-200 dark:border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MATHA Logo" className="h-10 w-auto object-contain" />
        </div>

        {/* Mega Menu Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          {[
            { id: "about", label: "About" },
            { id: "services", label: "Services" },
            { id: "partners", label: "Partners" },
            { id: "student", label: "Student Corner" },
            { id: "media", label: "Media" }
          ].map((item) => (
            <div 
              key={item.id} 
              className="relative py-2 cursor-pointer group"
              onMouseEnter={() => setActiveMenu(item.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <span className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
                <span>{item.label}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </span>

              <AnimatePresence>
                {activeMenu === item.id && (
                  <motion.div
                    initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={animationsEnabled ? { opacity: 0, y: 10 } : { opacity: 1 }}
                    className="absolute top-8 left-1/2 -translate-x-1/2 w-[350px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-5 rounded-2xl shadow-2xl z-50 grid grid-cols-1 gap-3"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl pointer-events-none" />
                    
                    {MEGA_MENUS[item.id].map((sub, sidx) => (
                      <Link 
                        key={sidx} 
                        href={sub.url}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all group/sub"
                      >
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover/sub:bg-amber-500/15 group-hover/sub:text-amber-500 dark:group-hover/sub:text-amber-400 transition-colors">
                          <sub.icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover/sub:text-amber-500 dark:group-hover/sub:text-amber-400 transition-colors">
                            {sub.label}
                          </span>
                          <span className="block text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 normal-case tracking-normal">
                            {sub.desc}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <a href="#contact" className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors py-2">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          {/* Animation Toggle Control for Reduced Motion/WCAG */}
          <button
            onClick={() => setAnimationsEnabled(!animationsEnabled)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            title={animationsEnabled ? "Disable UI Animations" : "Enable UI Animations"}
            aria-label={animationsEnabled ? "Disable UI Animations" : "Enable UI Animations"}
          >
            {animationsEnabled ? <Eye className="w-4 h-4 text-indigo-500" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          <Link
            href="/auth/login"
            className="relative px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-[1.03] hover:shadow-indigo-600/30 transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Access LMS Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[92vh] flex flex-col lg:flex-row items-center justify-between px-8 lg:px-16 py-12 z-10">
        
        {/* Left: Content panel */}
        <div className="w-full lg:w-[50%] space-y-6 text-left max-w-2xl">
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/25 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Transforming Skills Into Careers</span>
          </motion.div>

          <motion.h1
            initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
          >
            18+ Years of{" "}
            <span className="bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 dark:from-amber-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Excellence
            </span>
          </motion.h1>

          <motion.p
            initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
          >
            Empowering students with quality education, employability skills, professional certifications, and placement opportunities. Matha Educational Society shapes students into industry-ready professionals.
          </motion.p>

          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <Link
              href="/auth/login"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/35 hover:scale-[1.02] transition-all group"
            >
              <span>Access LMS Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#courses"
              className="flex items-center justify-center px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-200/50 dark:bg-slate-900/50 hover:bg-slate-300/60 dark:hover:bg-slate-800 font-bold text-sm text-slate-800 dark:text-slate-200 transition-all"
            >
              Explore Courses
            </a>
          </motion.div>
        </div>

        {/* Right: Premium 2D Vector Animated Scene */}
        <div className="w-full lg:w-[45%] h-[400px] lg:h-[550px] relative mt-12 lg:mt-0 flex items-center justify-center">
          <div className="w-full h-full rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-indigo-50/20 via-slate-100/50 to-purple-50/20 dark:from-indigo-950/20 dark:via-slate-900/50 dark:to-purple-950/20 shadow-2xl relative overflow-hidden flex items-center justify-center p-8">
            {/* grid pattern backdrop */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35" />

            {/* Glowing gradient blur rings */}
            <motion.div 
              animate={animationsEnabled ? { scale: [1, 1.15, 1], opacity: [0.3, 0.45, 0.3] } : {}}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute w-72 h-72 rounded-full bg-indigo-500/10 blur-[60px] pointer-events-none" 
            />
            <motion.div 
              animate={animationsEnabled ? { scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] } : {}}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
              className="absolute w-80 h-80 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" 
            />

            {/* Floating 2D Vector Elements */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
              
              {/* Pulsing floating center icon */}
              <motion.div
                animate={animationsEnabled ? { y: [0, -15, 0] } : {}}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="w-24 h-24 bg-gradient-to-tr from-amber-500/15 via-indigo-600/20 to-purple-600/15 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-600/10 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-400 to-purple-500 opacity-20 blur" />
                <GraduationCap className="w-12 h-12 text-amber-500 dark:text-amber-400 relative z-10" />
              </motion.div>

              {/* Floating mini cards mapping courses */}
              <div className="absolute top-[20%] -left-12">
                <motion.div 
                  animate={animationsEnabled ? { y: [0, 10, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 hover:border-amber-500/25 transition-colors cursor-default"
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Solar Suryamitra</span>
                </motion.div>
              </div>

              <div className="absolute bottom-[20%] -right-12">
                <motion.div 
                  animate={animationsEnabled ? { y: [0, -12, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
                  className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-lg text-[10px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 hover:border-amber-500/25 transition-colors cursor-default"
                >
                  <BookOpen className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Software Developer</span>
                </motion.div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-200 font-sans tracking-wide">Skills Development</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed font-medium">
                  Join vocational programs, configure onboarding profiles, pass VARK learning style assessments, and get placed.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* About MATHA */}
      <section id="about" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Legacy</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">About Matha Educational Society</span></h2>
            </motion.div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Matha Educational Society is one of India's fastest-growing skill development organizations. For over 18 years, the organization has provided quality training, employability programs, and placement support through industry-oriented courses.
            </p>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Matha Educational Society delivers practical training, career guidance, internships, and job opportunities that help students become industry-ready professionals. The organization has successfully trained thousands of students and maintains a strong placement record.
            </p>
          </div>

          <div className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 grid grid-cols-1 gap-4 glass">
            <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Future Career Internships</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Explore career opportunities through internship programs designed for college students and industry readiness. Gain exposure to actual projects and build skills mapping directly to employer metrics.
            </p>
            <ul className="text-xs text-slate-650 dark:text-slate-400 space-y-2 mt-2 font-medium border-t border-slate-200/50 dark:border-white/5 pt-3">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Gain corporate experience with Samsung, Voltas & Reliance.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Earn industry-recognized certifications upon completion.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Direct pathway to final-round placement interviews.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link 
                href="/auth/login" 
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
              >
                <span>Register for Internships</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do & Why Choose Us */}
      <section className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-6">
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Core Purpose</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">What We Do</span></h2>
            </motion.div>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Matha Educational Society provides top-quality training and skill development programs, equipping learners with practical knowledge, professional expertise, and confidence to excel in today's competitive job market.
            </p>
            <div className="pt-4 border-t border-slate-200/50 dark:border-white/5 space-y-3">
              <span className="block text-xs uppercase font-bold tracking-wide text-slate-500">Key Focus Schemes</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="block font-bold text-slate-800 dark:text-slate-200">DDU-GKY</span>
                  <span>Rural youth placement programs.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5">
                  <span className="block font-bold text-slate-800 dark:text-slate-200">Suryamitra</span>
                  <span>Solar PV installation tracks.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: "Industry Relevant Courses", desc: "We offer skill-based programs designed to meet the demands of today's job market." },
              { title: "Expert Trainers", desc: "Learn from experienced industry professionals dedicated to student success." },
              { title: "Flexible Learning", desc: "Both classroom and online learning options are available." },
              { title: "Modern Facilities", desc: "Advanced training infrastructure and technology-enabled classrooms." },
              { title: "Placement Assistance", desc: "Resume support, interview preparation, and placement guidance." },
              { title: "Proven Track Record", desc: "Thousands of students trained with successful career outcomes." }
            ].map((node, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 flex flex-col justify-between hover:border-amber-500/20 hover:scale-[1.01] transition-all duration-200">
                <div className="space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{node.title}</h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-normal font-medium">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
          whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-2"
        >
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Offerings</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">Employability Services</span></h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Structured training pillars mapping skills to corporate placements.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { title: "Skill Development", desc: "Practical and industry-relevant training programs.", icon: Cpu },
            { title: "Competitive Coaching", desc: "Exam preparation with expert faculty.", icon: BookOpen },
            { title: "Global Certification", desc: "Industry certifications recognized worldwide.", icon: GraduationCap },
            { title: "Career Fair", desc: "Job fairs, interviews, and recruitment opportunities.", icon: Briefcase }
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 shadow flex flex-col justify-between hover:scale-[1.02] hover:border-amber-500/25 transition-all duration-200">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-slate-200 dark:border-white/5">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{item.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Institutional Portal Section */}
      <section className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Graphic / Illustration */}
          <div className="lg:col-span-5 relative h-[400px] rounded-3xl border border-slate-200 dark:border-white/10 bg-gradient-to-br from-indigo-50/20 via-slate-100/50 to-purple-50/20 dark:from-indigo-950/20 dark:via-slate-900/50 dark:to-purple-950/20 shadow-xl overflow-hidden flex items-center justify-center p-8">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-25" />
            <div className="absolute w-48 h-48 bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none animate-pulse" />
            
            <div className="relative z-10 text-center space-y-4">
              <div className="w-20 h-20 bg-gradient-to-tr from-amber-500/15 via-indigo-600/20 to-purple-600/15 rounded-3xl flex items-center justify-center border border-slate-200 dark:border-white/10 shadow-xl mx-auto">
                <School className="w-10 h-10 text-amber-500 dark:text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Institutional Workspace</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Multi-Tenant Management</p>
              </div>
            </div>
          </div>

          {/* Right Side: Features list (matching the screenshot) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="space-y-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Enterprise SaaS Suite</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">For Colleges & Training Agencies</span></h2>
              <p className="text-sm text-slate-650 dark:text-slate-355 font-bold mt-2">Turn classrooms into careers.</p>
            </div>

            <ul className="space-y-4 pt-2">
              {[
                { title: "College Integration", desc: "Upload rosters, run employability surveys, track outcomes." },
                { title: "Curriculum Alignment", desc: "Real-time alerts on emerging skill gaps." },
                { title: "Agency Dashboards", desc: "Manage batches, assessments, and milestone payments." },
                { title: "Feedback Loops", desc: "Continuous improvement with employer & student feedback." },
                { title: "Performance Tracking", desc: "Monitor student progress and placement rates." }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.title} – </span>
                    <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/35 hover:scale-[1.02] transition-all group"
              >
                <span>Access Institutional Portal</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <motion.div
            initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
            whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="space-y-1"
          >
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Curriculum Registry</span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mt-1"><span className="interactive-heading">Industry Courses</span></h2>
          </motion.div>
          <div className="flex gap-2">
            <button 
              onClick={() => setCourseIdx(Math.max(0, courseIdx - 1))}
              disabled={courseIdx === 0}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 disabled:opacity-40 font-extrabold text-xs text-slate-700 dark:text-slate-200 hover:border-amber-500/20"
            >
              Previous
            </button>
            <button 
              onClick={() => setCourseIdx(Math.min(2, courseIdx + 1))}
              disabled={courseIdx === 2}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 disabled:opacity-40 font-extrabold text-xs text-slate-700 dark:text-slate-200 hover:border-amber-500/20"
            >
              Next
            </button>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.slice(courseIdx * 3, courseIdx * 3 + 3).map((course, idx) => (
            <motion.div 
              key={idx}
              initial={animationsEnabled ? { opacity: 0, y: 15 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 shadow flex flex-col justify-between hover:scale-[1.01] hover:border-slate-300 dark:hover:border-white/15 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded w-max">
                  {course.category}
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-2">{course.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{course.desc}</p>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-white/5 mt-6 space-y-3">
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Duration: <strong className="text-slate-800 dark:text-slate-200">{course.duration}</strong></span>
                  <span>Employability: <strong className="text-indigo-600 dark:text-indigo-400">{course.employability}</strong></span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                  <span>Placement: <strong className="text-slate-800 dark:text-slate-200">{course.placement}</strong></span>
                </div>
                <Link
                  href="/auth/login"
                  className="w-full flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Enroll Course
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200 dark:border-white/5 relative z-10">
        <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-5 gap-8">
          {[
            { label: "Years of Excellence", val: "18+" },
            { label: "Students Trained", val: "18,500+" },
            { label: "Students Under Training", val: "1,200+" },
            { label: "Placements", val: "12,800+" },
            { label: "Self-Employed", val: "2,100+" }
          ].map((stat, idx) => (
            <div key={idx} className="text-center space-y-1.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-white/5">
              <span className="block text-3xl font-black bg-gradient-to-r from-amber-600 to-indigo-600 dark:from-amber-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {stat.val}
              </span>
              <span className="block text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories (Testimonials) */}
      <section id="testimonials" className="container mx-auto px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Our Graduates</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">Success Stories</span></h2>
            </motion.div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Discover real vocational placement outcomes of candidates placed at global industries and engineering support hubs.
            </p>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, tidx) => (
                <button
                  key={tidx}
                  onClick={() => setTestimIdx(tidx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${tidx === testimIdx ? "bg-amber-500 w-6" : "bg-slate-300 dark:bg-slate-700"}`}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimIdx}
                initial={animationsEnabled ? { opacity: 0, x: 20 } : { opacity: 1 }}
                animate={{ opacity: 1, x: 0 }}
                exit={animationsEnabled ? { opacity: 0, x: -20 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="p-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-xl glass relative"
              >
                <div className="absolute top-4 right-4 text-6xl text-slate-300 dark:text-white/5 font-serif select-none pointer-events-none">&ldquo;</div>
                
                {/* Mock Video Thumbnail preview */}
                <div className="mb-4 aspect-video w-full rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 flex items-center justify-center group overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-900/10 pointer-events-none" />
                  <button 
                    onClick={() => setVideoModal(TESTIMONIALS[testimIdx].name)}
                    className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-all relative z-10"
                  >
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </button>
                  <span className="absolute bottom-3 left-3 text-[10px] font-bold text-slate-700 dark:text-slate-400 bg-white/90 dark:bg-slate-900/80 px-2 py-0.5 rounded">
                    Watch Placement Interview Clip
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-700 dark:text-slate-300">
                  &ldquo;{TESTIMONIALS[testimIdx].text}&rdquo;
                </p>
                <div className="mt-6 flex justify-between items-center border-t border-slate-200 dark:border-white/5 pt-4">
                  <div>
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{TESTIMONIALS[testimIdx].name}</span>
                    <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5 font-bold uppercase">{TESTIMONIALS[testimIdx].outcome}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">{TESTIMONIALS[testimIdx].tag}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Placement Section */}
      <section id="placements" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10 bg-white dark:bg-slate-900/10 rounded-3xl">
        <motion.div
          initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
          whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-2"
        >
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Hiring Alignment</span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">Placement Statistics</span></h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Verifiable tie-ups with active hiring partners and recruiters.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 space-y-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block border-b border-slate-200 dark:border-white/5 pb-2">Employment Outcomes</span>
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Annual Employed Ratio</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">86%</span>
              </div>
              <div className="flex justify-between">
                <span>Self-Employed Ratio</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">14%</span>
              </div>
              <div className="flex justify-between">
                <span>Hiring Companies</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">380+ Partners</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 space-y-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block border-b border-slate-200 dark:border-white/5 pb-2">Salary Benchmarks</span>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl text-center">
                <span className="block text-xl font-black text-amber-600 dark:text-amber-400">₹3.6 Lakhs</span>
                <span className="block text-[9px] text-slate-500 uppercase mt-0.5">Average Salary p.a</span>
              </div>
              <div className="p-3 bg-slate-100 dark:bg-slate-950 rounded-xl text-center">
                <span className="block text-xl font-black text-slate-800 dark:text-slate-200">₹8.4 Lakhs</span>
                <span className="block text-[9px] text-slate-500 uppercase mt-0.5">Highest package p.a</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase block border-b border-slate-200 dark:border-white/5 pb-2">Hiring Companies</span>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Samsung", "Voltas", "Reliance", "Apollo Pharmacy", "IT Solutions", "Airtel Support"].map((logo, idx) => (
                  <span key={idx} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-white/5 text-[10px] font-bold text-slate-700 dark:text-slate-400">
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Accreditation</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">Awards & Recognition</span></h2>
            </motion.div>
            <div className="p-6 rounded-2xl border border-amber-500/20 dark:border-amber-400/30 bg-amber-500/5 dark:bg-amber-400/5 space-y-3">
              <span className="block text-xs font-black text-amber-600 dark:text-amber-400 uppercase">State Recognition</span>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Best Training Partner Award Winner in Andhra Pradesh</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Awarded by state employment departments for demonstrating excellence in DDU-GKY vocational skills training, placement outcomes, and Suryamitra installations.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 h-[350px] relative rounded-3xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/40 overflow-hidden flex items-center justify-center p-6">
            <div className="absolute w-48 h-48 bg-amber-500/10 rounded-full blur-[40px] pointer-events-none animate-pulse" />
            
            <motion.div 
              whileHover={animationsEnabled ? { scale: 1.05 } : {}}
              className="flex flex-col items-center justify-center relative z-10 text-center space-y-4"
            >
              <svg 
                width="160" 
                height="160" 
                viewBox="0 0 100 100" 
                className="drop-shadow-[0_10px_30px_rgba(245,158,11,0.25)] filter"
              >
                <defs>
                  <linearGradient id="gold-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF9E6" />
                    <stop offset="30%" stopColor="#F5C03D" />
                    <stop offset="70%" stopColor="#D48F0E" />
                    <stop offset="100%" stopColor="#8A5A00" />
                  </linearGradient>
                  <linearGradient id="gold-highlight" x1="100%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FFF" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#FAD961" />
                    <stop offset="100%" stopColor="#F76B1C" />
                  </linearGradient>
                  <linearGradient id="dark-base" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#1E293B" />
                    <stop offset="50%" stopColor="#334155" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </linearGradient>
                  <radialGradient id="trophy-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#F5A623" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle cx="50%" cy="45%" r="35" fill="url(#trophy-glow)" />

                <path d="M22,30 C12,30 12,50 24,50" fill="none" stroke="url(#gold-primary)" strokeWidth="5.5" strokeLinecap="round" />
                <path d="M78,30 C88,30 88,50 76,50" fill="none" stroke="url(#gold-primary)" strokeWidth="5.5" strokeLinecap="round" />

                <path d="M25,25 L75,25 C75,25 75,55 50,62 C25,55 25,25 25,25 Z" fill="url(#gold-primary)" />
                <path d="M30,28 L70,28 C70,28 68,52 50,57 C32,52 30,28 30,28 Z" fill="url(#gold-highlight)" opacity="0.65" />

                <path d="M43,60 L57,60 L54,75 L46,75 Z" fill="url(#gold-primary)" />
                <ellipse cx="50" cy="74" rx="10" ry="2.5" fill="url(#gold-highlight)" />

                <path d="M35,77 L65,77 L62,84 L38,84 Z" fill="url(#gold-primary)" />
                <rect x="28" y="84" width="44" height="12" rx="2" fill="url(#dark-base)" stroke="url(#gold-primary)" strokeWidth="1.5" />
                <line x1="32" x2="68" y1="90" y2="90" stroke="url(#gold-highlight)" strokeWidth="1" />

                <g fill="#FFF">
                  <path d="M72,20 L74,24 L78,25 L74,26 L72,30 L70,26 L66,25 L70,24 Z" opacity="0.9" />
                  <path d="M24,52 L25,54 L27,55 L25,56 L24,58 L23,56 L21,55 L23,54 Z" opacity="0.8" />
                </g>
              </svg>
              
              <div>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-widest mt-2">AP State Excellence Award</span>
                <span className="block text-[10px] text-slate-500 uppercase font-bold">Matha Educational Trust</span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-8 py-24 border-t border-slate-200 dark:border-white/5 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <motion.div
              initial={animationsEnabled ? { opacity: 0, y: 20 } : { opacity: 1 }}
              whileInView={animationsEnabled ? { opacity: 1, y: 0 } : {}}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">Connect</span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight"><span className="interactive-heading">Contact Us</span></h2>
            </motion.div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Reach out to our East Godavari district administration team to inquire about training batches, class admissions, or placement schedules.
            </p>

            <div className="space-y-4 pt-4 text-xs font-medium">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-slate-700 dark:text-slate-300">
                  <span className="font-bold block text-slate-900 dark:text-slate-100">Matha Educational Society HQ</span>
                  <span>79-17-13/1, Beside Roop Vihar Towers,</span>
                  <span className="block">Raja Street, Tilak Road, Rajamahendravaram,</span>
                  <span>East Godavari District, Andhra Pradesh – 533101</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500" />
                <span className="text-slate-700 dark:text-slate-300">(+91) 85558 40559</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-400" />
                <span className="text-slate-700 dark:text-slate-300">info@mesindia.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400" />
                <span className="text-slate-700 dark:text-slate-300">Monday to Sunday: 8:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-xl relative overflow-hidden glass">
            <h3 className="text-base font-bold mb-4 text-slate-800 dark:text-slate-200">Send an Inquiry</h3>
            
            {success && (
              <div className="mb-4 p-3 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4.5 h-4.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Prasanna Kumar"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-msg" className="text-[9px] uppercase font-bold text-slate-600 dark:text-slate-400">Inquiry Message</label>
                <textarea
                  id="contact-msg"
                  rows={4}
                  required
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Tell us about the courses or placement assistance you need..."
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/20 hover:scale-[1.02] transition-all"
              >
                Send Message
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {videoModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-6 z-[999]">
            <motion.div
              initial={animationsEnabled ? { scale: 0.95, opacity: 0 } : { opacity: 1 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={animationsEnabled ? { scale: 0.95, opacity: 0 } : { opacity: 1 }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="p-4 border-b border-slate-200 dark:border-white/10 flex justify-between items-center bg-slate-100 dark:bg-slate-950">
                <span className="text-xs font-bold text-amber-600">Success Story: {videoModal}</span>
                <button onClick={() => setVideoModal(null)} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-bold text-sm">×</button>
              </div>
              <div className="aspect-video bg-black flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                  <Play className="w-14 h-14 text-amber-500 animate-pulse mx-auto" />
                  <span className="block text-xs text-slate-400 font-sans">Simulating placement interview record stream.</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full py-12 border-t border-slate-200 dark:border-white/5 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 mt-auto text-xs text-slate-600 dark:text-slate-400 relative overflow-hidden">
        {/* Animated Flare/Floating Particles background */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={animationsEnabled ? {
                y: [0, -40, 0],
                x: [0, 20, 0],
                opacity: [0.12, 0.35, 0.12],
                scale: [1, 1.15, 1]
              } : {}}
              transition={{
                repeat: Infinity,
                duration: 6 + i * 2,
                ease: "easeInOut",
                delay: i * 0.5
              }}
              className="absolute rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[25px]"
              style={{
                width: `${50 + i * 30}px`,
                height: `${50 + i * 30}px`,
                bottom: `${-10 + i * 15}%`,
                left: `${15 + i * 12}%`,
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`p-${i}`}
              animate={animationsEnabled ? {
                y: [0, -80, 0],
                opacity: [0.15, 0.6, 0.15]
              } : {}}
              transition={{
                repeat: Infinity,
                duration: 8 + i * 3,
                ease: "linear",
                delay: i * 0.8
              }}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              style={{
                bottom: `${5 + ((i * 13 + 7) % 20)}%`,
                left: `${10 + i * 11}%`,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="MATHA Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-[11px] leading-relaxed text-slate-750 dark:text-slate-350 font-medium">
              Matha Educational Society is dedicated to bridging vocational education pathways to active corporate recruitment.
            </p>
          </div>

          <div className="space-y-4">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Government Portals</span>
            <div className="grid grid-cols-1 gap-2 text-[11px]">
              <a href="https://www.skillindiadigital.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                <span>Skill India Digital</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a href="http://www.seedap.ap.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                <span>SEEDAP</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a href="https://kaushalbharat.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                <span>Kaushal Bharat</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Useful Connections</span>
            <div className="grid grid-cols-1 gap-2 text-[11px]">
              <a href="https://www.kaushalpanj.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                <span>Kaushal Panj</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
              <a href="https://nqr.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
                <span>National Qualifications Register</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider block">Working Hours</span>
            <p className="text-[11px] text-slate-700 dark:text-slate-400 leading-relaxed font-bold">
              Monday to Sunday:
              <strong className="block text-slate-800 dark:text-slate-200 mt-0.5">8:00 AM – 8:00 PM</strong>
            </p>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-slate-200 dark:border-white/5 font-bold text-[11px] text-slate-500 dark:text-slate-600 relative z-10">
          <p>© 2026 Matha Educational Society. All rights reserved. Registered Educational Trust, India.</p>
        </div>
      </footer>
    </div>
  );
}
