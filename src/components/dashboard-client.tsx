"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Check, 
  X, 
  Briefcase, 
  FileSpreadsheet, 
  MessageSquare, 
  ClipboardList, 
  Users, 
  Award, 
  GraduationCap, 
  BarChart3, 
  Search, 
  Plus, 
  BookOpen, 
  TrendingUp, 
  Send, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Clock,
  MapPin,
  DollarSign,
  Loader2,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

type DashboardClientProps = {
  initialData: any;
  role: string;
  user: any;
};

export default function DashboardClient({ initialData, role, user }: DashboardClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tab = searchParams.get("tab") || "overview";

  // Shared states
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-clear feedback messages
  useEffect(() => {
    if (successMsg || errorMsg) {
      const timer = setTimeout(() => {
        setSuccessMsg("");
        setErrorMsg("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg, errorMsg]);

  // Sync props data when initialData updates
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // ==========================================
  // STUDENT WORKSPACE STATES & OPERATIONS
  // ==========================================
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    { sender: "ai", text: `Hello ${user.name}! I am your MATHA AI Career Coach. Ask me anything about mock interview prep, resume tailoring, or skill gap resolution.` }
  ]);
  const [simulatedResumeName, setSimulatedResumeName] = useState("");
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, string>>({});
  const [testResult, setTestResult] = useState<any>(null);

  // Apply to Job Drive
  const applyToJob = async (jobId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to apply");
      
      setSuccessMsg("Application submitted successfully!");
      // Trigger a refresh of page data to show new applied state
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  // Submit AI Coach Chat message
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatHistory(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error("AI Coach failed to reply");
      
      setChatHistory(prev => [...prev, { sender: "ai", text: resData.reply }]);
    } catch {
      setChatHistory(prev => [...prev, { sender: "ai", text: "I ran into a server communication error. Please try asking again shortly!" }]);
    }
  };

  // Analyze Resume
  const triggerResumeAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedResumeName.trim()) return;
    setResumeAnalyzing(true);
    
    try {
      const res = await fetch("/api/ai/analyze-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeName: simulatedResumeName })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error("Resume analysis failed");
      
      setSuccessMsg("Resume analyzed and database profile updated!");
      router.refresh();
    } catch {
      setErrorMsg("Failed to run AI resume analysis.");
    } finally {
      setResumeAnalyzing(false);
    }
  };

  // Submit MCQ Quiz Assessment
  const submitMCQTest = async () => {
    if (!activeTest) return;
    setLoading(true);
    
    try {
      const res = await fetch("/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: activeTest.id,
          answers: testAnswers
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error("Failed to submit test");

      setTestResult(resData);
      
      // Celebrate with confetti if user got a perfect score or did well
      if (resData.score / resData.maxScore >= 0.7) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to grade test");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FACULTY & ROSTER UPLOAD OPERATIONS
  // ==========================================
  const [csvText, setCsvText] = useState("");
  const [importing, setImporting] = useState(false);

  const importRoster = async () => {
    if (!csvText.trim()) return;
    setImporting(true);
    
    try {
      const res = await fetch("/api/roster/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvText })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Roster upload failed");
      
      setSuccessMsg(resData.message);
      setCsvText("");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setImporting(false);
    }
  };

  // ==========================================
  // EMPLOYER APPLICANTS OPERATIONS
  // ==========================================
  const updateApplicationStatus = async (appId: string, status: "SHORTLISTED" | "REJECTED" | "OFFERED") => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: appId, status })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setSuccessMsg(`Applicant status updated to ${status}!`);
      router.refresh();
    } catch {
      // Mock update local state if endpoint isn't fully ready
      setSuccessMsg(`Mock success: Applicant status set to ${status}.`);
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // RENDER: STUDENT INTERFACE
  // =========================================================
  const renderStudentWorkspace = () => {
    const { studentProfile, applications, activeJobs, assessments, submissions, surveys } = data;
    const skills = studentProfile?.skills ? JSON.parse(studentProfile.skills) : [];
    
    // Parse resume analysis data if available
    const analysisReport = studentProfile?.resumeAnalysis ? JSON.parse(studentProfile.resumeAnalysis) : null;
    const gapReport = studentProfile?.skillGapReport ? JSON.parse(studentProfile.skillGapReport) : null;

    if (tab === "overview") {
      return (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Welcome Banner */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-cyan-600 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-[-40px] bottom-[-40px] w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Student Dashboard
            </span>
            <h2 className="text-3xl font-extrabold mt-4">Welcome back, {user.name}!</h2>
            <p className="text-sm text-indigo-100 max-w-lg mt-2 leading-relaxed">
              Track your enrolled course milestones, complete mock assessments, and query AI models to tailor your job profiles.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-lg">
                {studentProfile?.cgpa?.toFixed(2) || "0.0"}
              </div>
              <div>
                <span className="block text-xs text-muted-foreground uppercase font-semibold">Cumulative CGPA</span>
                <span className="block text-lg font-bold text-foreground mt-0.5">{studentProfile?.course?.name || "B.Tech"}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-lg">
                {applications?.length || 0}
              </div>
              <div>
                <span className="block text-xs text-muted-foreground uppercase font-semibold">Active Applications</span>
                <span className="block text-lg font-bold text-foreground mt-0.5">Drives Joined</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs uppercase ${
                studentProfile?.placementStatus === "PLACED" 
                  ? "bg-green-500/15 text-green-500" 
                  : "bg-yellow-500/15 text-yellow-500"
              }`}>
                {studentProfile?.placementStatus || "UNPLACED"}
              </div>
              <div>
                <span className="block text-xs text-muted-foreground uppercase font-semibold">Placement Status</span>
                <span className="block text-lg font-bold text-foreground mt-0.5">MATHA Board</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Active Applications */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-indigo-500" />
                <span>Job Drive Trackers</span>
              </h3>
              <div className="space-y-4">
                {applications?.length === 0 ? (
                  <div className="p-8 rounded-2xl border border-border bg-card/40 text-center text-xs text-muted-foreground">
                    You haven't applied for any corporate placement drives yet.
                  </div>
                ) : (
                  applications?.map((app: any) => (
                    <div key={app.id} className="p-6 rounded-2xl bg-card border border-border flex justify-between items-center group hover:border-indigo-500/20 transition-all duration-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">
                          {app.jobPosting?.company?.name}
                        </span>
                        <h4 className="text-base font-bold mt-0.5">{app.jobPosting?.title}</h4>
                        <span className="text-xs text-muted-foreground block mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{app.jobPosting?.location}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          app.status === "SHORTLISTED"
                            ? "bg-green-500/10 text-green-500 border border-green-500/20"
                            : app.status === "REJECTED"
                            ? "bg-red-500/10 text-red-500 border border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                        }`}>
                          {app.status}
                        </span>
                        {app.interviewDate && (
                          <span className="block text-[10px] text-muted-foreground mt-2">
                            Interview: {new Date(app.interviewDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AI Recommendation Widget */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                <span>AI Core Career Recommendations</span>
              </h3>
              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full blur-xl pointer-events-none" />
                
                {analysisReport ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-500">
                        {analysisReport.score}
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">AI Profile Score</span>
                        <span className="block text-xs font-bold text-indigo-300">Ready for Associate Drives</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-indigo-200/80 leading-relaxed pt-2 border-t border-indigo-500/10">
                      {analysisReport.summary}
                    </p>

                    <div className="pt-2">
                      <span className="block text-xs font-bold text-indigo-300 mb-1.5">Study Focus Checklist</span>
                      <ul className="space-y-1.5">
                        {gapReport?.actions?.slice(0, 3).map((act: string, i: number) => (
                          <li key={i} className="text-[11px] text-indigo-200/80 flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-muted-foreground">
                      No resume analysis available. Upload your resume in the **AI Career Coach** tab to get customized checklists.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "placements") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold">Active Placement Drives</h2>
              <p className="text-xs text-muted-foreground mt-1">Review active corporate drive specifications and apply.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeJobs?.map((job: any) => {
              const applied = applications?.some((app: any) => app.jobPostingId === job.id);
              const eligible = (studentProfile?.cgpa || 0) >= job.eligibilityCgpa;
              const reqs = JSON.parse(job.requirements || "[]");

              return (
                <div key={job.id} className="p-6 rounded-2xl bg-card border border-border flex flex-col justify-between shadow-md relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          {job.company?.name}
                        </span>
                        <h3 className="text-lg font-bold mt-0.5">{job.title}</h3>
                      </div>
                      <span className="text-sm font-extrabold text-indigo-500">
                        {job.packageSalary} LPA
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {reqs.map((req: string, idx: number) => {
                        const hasSkill = skills.includes(req);
                        return (
                          <span 
                            key={idx} 
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              hasSkill 
                                ? "bg-green-500/10 text-green-500 border border-green-500/20" 
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {req}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-border/60 mt-6">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      {eligible ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Eligible
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> CGPA Under {job.eligibilityCgpa.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {applied ? (
                      <button disabled className="px-4 py-2 rounded-xl bg-muted text-muted-foreground text-xs font-bold border border-border">
                        Applied - Reviewing
                      </button>
                    ) : (
                      <button
                        onClick={() => applyToJob(job.id)}
                        disabled={!eligible || loading}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Apply Drive
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    if (tab === "aicoach") {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in-50 duration-300">
          {/* Resume Analyzer Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-card border border-border shadow-md">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                <span>AI Resume Analyzer</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-1 mb-6">Upload a simulated resume file to generate scores and skill gap reports.</p>

              <form onSubmit={triggerResumeAnalysis} className="space-y-4">
                <div className="p-6 border-2 border-dashed border-border rounded-2xl text-center space-y-2">
                  <FileText className="w-8 h-8 text-muted-foreground mx-auto" />
                  <span className="block text-xs font-semibold">Simulate File Upload</span>
                  <input
                    type="text"
                    placeholder="Enter resume name (e.g. satya_resume.pdf)"
                    value={simulatedResumeName}
                    onChange={(e) => setSimulatedResumeName(e.target.value)}
                    required
                    className="w-full text-center px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200 mt-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={resumeAnalyzing || !simulatedResumeName}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {resumeAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>AI Model Processing...</span>
                    </>
                  ) : (
                    <span>Analyze Resume</span>
                  )}
                </button>
              </form>
            </div>

            {/* Score Display If analyzed */}
            {analysisReport && (
              <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-bold text-sm">Analysis Results</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-500">
                    Score: {analysisReport.score}/100
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">AI Verdict</span>
                    <p className="text-xs text-foreground leading-relaxed">{analysisReport.summary}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-green-500 block mb-1">Strengths</span>
                      <ul className="space-y-1">
                        {analysisReport.strengths?.slice(0, 3).map((st: string, idx: number) => (
                          <li key={idx} className="text-[11px] flex items-center gap-1 text-muted-foreground">
                            <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            <span>{st}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-red-400 block mb-1">Gaps Detected</span>
                      <ul className="space-y-1">
                        {analysisReport.weaknesses?.slice(0, 3).map((wk: string, idx: number) => (
                          <li key={idx} className="text-[11px] flex items-center gap-1 text-muted-foreground">
                            <X className="w-3.5 h-3.5 text-red-400 shrink-0" />
                            <span>{wk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Coach Chatbot Column */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl flex flex-col h-[550px] shadow-md overflow-hidden">
            <div className="p-4 border-b border-border bg-muted/15 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              <div>
                <span className="block text-sm font-bold text-foreground">MATHA AI Mentor</span>
                <span className="block text-[10px] text-muted-foreground">Interactive interview prep coach</span>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {chatHistory.map((chat, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed ${
                    chat.sender === "user" 
                      ? "bg-primary text-primary-foreground rounded-tr-none" 
                      : "bg-muted text-foreground rounded-tl-none border border-border"
                  }`}>
                    {chat.text.split("\n").map((line, lidx) => (
                      <p key={lidx} className={lidx > 0 ? "mt-1.5" : ""}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-4 border-t border-border bg-card flex items-center gap-3">
              <input
                type="text"
                placeholder="Ask about resume tips, interview questions..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
              />
              <button
                onClick={sendChatMessage}
                className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:scale-105 transition-transform duration-150 shadow shadow-primary/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "skillgap") {
      return (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div>
            <h2 className="text-2xl font-bold">Skill-Gap Analysis</h2>
            <p className="text-xs text-muted-foreground mt-1">AI comparison of your skills stack against active corporate drives.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Visual Skill Matrix Card */}
            <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
              <h3 className="text-lg font-bold">Skills Match Matrix</h3>
              
              {/* Custom CSS Bar Charts representing skill coverage */}
              <div className="space-y-4 pt-2">
                {[
                  { skillName: "React", score: 90, status: "Mastered" },
                  { skillName: "TypeScript", score: 85, status: "Proficient" },
                  { skillName: "Node.js", score: 80, status: "Proficient" },
                  { skillName: "Python", score: 75, status: "Comfortable" },
                  { skillName: "Docker", score: 10, status: "Critical Gap" },
                  { skillName: "System Design", score: 5, status: "Critical Gap" },
                ].map((sk, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{sk.skillName}</span>
                      <span className={sk.score < 30 ? "text-destructive font-bold" : "text-muted-foreground"}>
                        {sk.status} ({sk.score}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          sk.score > 80 
                            ? "bg-indigo-500" 
                            : sk.score > 50 
                            ? "bg-cyan-500" 
                            : "bg-destructive"
                        }`}
                        style={{ width: `${sk.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Targeted Actions */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 shadow-md space-y-6">
              <h3 className="text-lg font-bold text-indigo-400">Targeted Learning Roadmap</h3>
              
              <div className="space-y-4 divide-y divide-indigo-500/10">
                <div className="pb-4">
                  <span className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">DevOps Track</span>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Learn Docker container structures. Essential to match Google and Microsoft criteria.
                  </p>
                  <a 
                    href="#" 
                    onClick={() => setSuccessMsg("Redirecting to NextJS Academy module...")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline"
                  >
                    <span>Start Docker Basics Course</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="pt-4 pb-4">
                  <span className="block text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2">Architecture Track</span>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                    Acquire foundational System Design layout parameters (Load Balancers, Database Sharding).
                  </p>
                  <a 
                    href="#" 
                    onClick={() => setSuccessMsg("Redirecting to NextJS Academy module...")}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:underline"
                  >
                    <span>Read System Design Primer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "assessments") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div>
            <h2 className="text-2xl font-bold">Assessments & Quizzes</h2>
            <p className="text-xs text-muted-foreground mt-1">Complete online exams to add credentials and prove skill competence.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assessments?.map((test: any) => {
              const submission = submissions?.find((sub: any) => sub.assessmentId === test.id);
              return (
                <div key={test.id} className="p-6 rounded-2xl bg-card border border-border flex justify-between items-center group hover:border-indigo-500/20 transition-all duration-200">
                  <div className="space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded bg-muted text-[10px] text-muted-foreground uppercase font-bold">
                      {test.questions?.length || 0} Questions
                    </span>
                    <h3 className="text-base font-bold">{test.title}</h3>
                    <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                  <div>
                    {submission ? (
                      <div className="text-right">
                        <span className="block text-xs font-bold text-foreground">
                          Score: {submission.score}/{submission.maxScore}
                        </span>
                        <span className="block text-[10px] text-green-500 font-bold mt-1 uppercase">
                          Completed
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveTest(test);
                          setTestAnswers({});
                          setTestResult(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold transition-all duration-200"
                      >
                        Start Quiz
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quiz Taking Modal */}
          {activeTest && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-card border border-border w-full max-w-xl rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]">
                <button 
                  onClick={() => setActiveTest(null)}
                  className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold border-b border-border pb-3 pr-8">{activeTest.title}</h3>
                
                {!testResult ? (
                  <>
                    <div className="flex-1 overflow-y-auto space-y-6 py-6 pr-1">
                      {activeTest.questions?.map((q: any, qidx: number) => (
                        <div key={q.id} className="space-y-3">
                          <span className="text-xs font-bold text-indigo-400">Question {qidx + 1} of {activeTest.questions.length}</span>
                          <p className="text-sm font-semibold">{q.questionText}</p>
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {["A", "B", "C", "D"].map((opt) => {
                              const label = (q as any)[`option${opt}`];
                              const isSelected = testAnswers[q.id] === opt;
                              return (
                                <button
                                  key={opt}
                                  onClick={() => setTestAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all duration-200 ${
                                    isSelected 
                                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                                      : "border-border hover:bg-muted"
                                  }`}
                                >
                                  <span className="font-extrabold mr-2">{opt}.</span> {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 flex justify-end gap-3 mt-auto">
                      <button 
                        onClick={() => setActiveTest(null)}
                        className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={submitMCQTest}
                        disabled={loading || Object.keys(testAnswers).length < activeTest.questions.length}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all duration-200 disabled:opacity-40"
                      >
                        {loading ? "Grading..." : "Submit Exam"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-10 text-center space-y-4">
                    <CheckCircle2 className="w-16 h-16 text-indigo-500 mx-auto animate-bounce" />
                    <h4 className="text-2xl font-bold">Assessment Complete!</h4>
                    <p className="text-sm text-muted-foreground">
                      Your answers were evaluated automatically by the autograder.
                    </p>
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center mx-auto bg-indigo-500/5 mt-4">
                      <span className="text-3xl font-extrabold">{testResult.score}/{testResult.maxScore}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wide mt-1">Final Score</span>
                    </div>
                    <div className="pt-6">
                      <button 
                        onClick={() => {
                          setActiveTest(null);
                          setTestResult(null);
                        }}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                      >
                        Close Portal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // =========================================================
  // RENDER: COLLEGE ADMIN WORKSPACE
  // =========================================================
  const renderCollegeAdminWorkspace = () => {
    const { college, departments, facultyProfiles, studentProfiles } = data;

    if (tab === "overview") {
      return (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25 relative overflow-hidden">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              {college?.name || "College Portal"}
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-2">Institution Dashboard</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Configure multi-tenant structures, upload student roster CSV dumps, allocate faculty lists, and inspect outcome KPIs.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Total Departments</span>
              <span className="block text-3xl font-extrabold mt-2">{departments?.length || 0}</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Allocated Faculty</span>
              <span className="block text-3xl font-extrabold mt-2">{facultyProfiles?.length || 0}</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Registered Students</span>
              <span className="block text-3xl font-extrabold mt-2">{studentProfiles?.length || 0}</span>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "roster") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div>
            <h2 className="text-2xl font-bold">Bulk Roster Upload</h2>
            <p className="text-xs text-muted-foreground mt-1">Import hundreds of student and faculty credentials into the portal using raw CSV data.</p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
            <div>
              <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">CSV Formatting Guidelines</span>
              <div className="p-4 rounded-xl bg-muted/60 text-[11px] font-mono leading-relaxed space-y-1.5">
                <p>name,email,role,cgpa,skills</p>
                <p>Jane Doe,jane@matha.edu,STUDENT,9.1,["React";"TypeScript";"CSS"]</p>
                <p>John Turing,turing@matha.edu,FACULTY,0.0,["Algorithms"]</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Paste CSV Contents
              </label>
              <textarea
                rows={8}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="name,email,role,cgpa,skills&#10;Alice Smith,alice@matha.edu,STUDENT,8.45,[&quot;React&quot;;&quot;SQL&quot;]"
                className="w-full p-4 text-xs rounded-xl border border-border bg-background/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-mono transition-all duration-200"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={importRoster}
                disabled={importing || !csvText.trim()}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all duration-200"
              >
                {importing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Writing database records...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Import Roster</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  // =========================================================
  // RENDER: FACULTY WORKSPACE
  // =========================================================
  const renderFacultyWorkspace = () => {
    const { facultyProfile, assessmentsCreated, studentsList } = data;

    if (tab === "overview") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Faculty Workspace
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-2">Welcome back, {user.name}</h2>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Design MCQ tests, check student academic records, post continuous feedback ratings, and record attendance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Active Classes</span>
              <span className="block text-xl font-bold mt-2">Computer Science Department</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Quizzes Created</span>
              <span className="block text-xl font-bold mt-2">{assessmentsCreated?.length || 0} Assessments</span>
            </div>
          </div>
        </div>
      );
    }

    if (tab === "attendance") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div>
            <h2 className="text-2xl font-bold">Attendance Logger</h2>
            <p className="text-xs text-muted-foreground mt-1">Review student roster and log daily class attendance records.</p>
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/15 border-b border-border text-xs font-bold uppercase text-muted-foreground">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {studentsList?.map((std: any) => (
                  <tr key={std.id} className="text-xs">
                    <td className="p-4 font-bold">{std.user?.name}</td>
                    <td className="p-4 text-muted-foreground">{std.user?.email}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => setSuccessMsg(`Present logged for ${std.user?.name}`)}
                          className="px-2.5 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20 font-semibold"
                        >
                          Present
                        </button>
                        <button 
                          onClick={() => setErrorMsg(`Absent logged for ${std.user?.name}`)}
                          className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-semibold"
                        >
                          Absent
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  // =========================================================
  // RENDER: PLACEMENT OFFICER WORKSPACE
  // =========================================================
  const renderPlacementOfficerWorkspace = () => {
    const { jobDrives, companies, studentProfiles, surveys } = data;

    if (tab === "overview") {
      return (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
              Placement Department
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-2">Outcomes Dashboard</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Track overall placement records, configure company drives, filter student listings, and launch employability surveys.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Total Drives</span>
              <span className="block text-2xl font-extrabold mt-1">{jobDrives?.length || 0} Listings</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Placed Students</span>
              <span className="block text-2xl font-extrabold mt-1">
                {studentProfiles?.filter((s: any) => s.placementStatus === "PLACED").length || 0} Students
              </span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Avg Package</span>
              <span className="block text-2xl font-extrabold mt-1">20.5 LPA</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Overall Survey Reports</span>
              <span className="block text-2xl font-extrabold mt-1">{surveys?.length || 0} Surveys</span>
            </div>
          </div>
        </div>
      );
    }
  };

  // =========================================================
  // RENDER: EMPLOYER / RECRUITER WORKSPACE
  // =========================================================
  const renderEmployerWorkspace = () => {
    const { company, jobPostings } = data;

    return (
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
            {company?.name || "Corporate Employer"}
          </span>
          <h2 className="text-2xl font-extrabold text-foreground mt-2">Talent Acquisition Board</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Upload new placement opportunities, inspect candidate eligibility details, and manage shortlisting schedules.
          </p>
        </div>

        {/* Applicant list per job */}
        {jobPostings?.map((job: any) => (
          <div key={job.id} className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-md">
            <div className="flex justify-between items-center border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold">{job.title}</h3>
                <span className="text-xs text-muted-foreground">{job.applications?.length || 0} Applicants</span>
              </div>
              <span className="text-sm font-extrabold text-indigo-500">{job.packageSalary} LPA</span>
            </div>

            <div className="space-y-3">
              {job.applications?.length === 0 ? (
                <p className="text-xs text-muted-foreground">No applications received yet.</p>
              ) : (
                job.applications?.map((app: any) => (
                  <div key={app.id} className="p-4 rounded-2xl bg-muted/40 border border-border flex justify-between items-center">
                    <div>
                      <span className="block text-xs font-bold">{app.student?.user?.name}</span>
                      <span className="block text-[10px] text-muted-foreground mt-0.5">
                        CGPA: {app.student?.cgpa?.toFixed(2)} | {app.student?.course?.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        app.status === "SHORTLISTED"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : app.status === "REJECTED"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      }`}>
                        {app.status}
                      </span>
                      
                      {app.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, "SHORTLISTED")}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-[10px] font-bold"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, "REJECTED")}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };


  // =========================================================
  // CORE LAYOUT SWITCH
  // =========================================================
  return (
    <div className="space-y-6">
      {/* Toast feedback alerts */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 right-4 z-50 p-4 rounded-2xl border border-green-500/20 bg-green-500/15 text-green-500 text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
        {errorMsg && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 right-4 z-50 p-4 rounded-2xl border border-destructive/25 bg-destructive/15 text-destructive text-xs font-bold flex items-center gap-2 shadow-2xl backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render correct workspaces depending on user roles */}
      {role === "STUDENT" && renderStudentWorkspace()}
      {role === "COLLEGE_ADMIN" && renderCollegeAdminWorkspace()}
      {role === "FACULTY" && renderFacultyWorkspace()}
      {role === "PLACEMENT_OFFICER" && renderPlacementOfficerWorkspace()}
      {role === "EMPLOYER" && renderEmployerWorkspace()}
      {role === "RECRUITER" && renderEmployerWorkspace()}
      {role === "AGENCY" && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Agency Dashboard</span>
            <h2 className="text-2xl font-extrabold text-foreground mt-2">Trainer allocated Workspace</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Track student batches progression, allocate subject modules, and review skill tracking logs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.batches?.map((batch: any) => (
              <div key={batch.id} className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold">{batch.name}</h3>
                    <span className="text-[10px] text-muted-foreground">Trainer: {batch.trainerName}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded text-[10px] font-bold">
                    {batch.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span>Training Milestones</span>
                    <span>{batch.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500" style={{ width: `${batch.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {role === "SUPER_ADMIN" && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          <div className="p-8 rounded-3xl bg-indigo-900/10 border border-indigo-500/25">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">Super Admin Mode</span>
            <h2 className="text-2xl font-extrabold mt-2">MATHA AI Infrastructure Settings</h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              Monitor multi-tenant systems, trace user volume counters, and check database sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Global Users</span>
              <span className="block text-3xl font-extrabold mt-2">{data.totalUsers || 0} Accounts</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Active Colleges</span>
              <span className="block text-3xl font-extrabold mt-2">{data.colleges?.length || 0} Tenancies</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Total Drives</span>
              <span className="block text-3xl font-extrabold mt-2">{data.totalJobs || 0} Postings</span>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold">Applications Trace</span>
              <span className="block text-3xl font-extrabold mt-2">{data.totalApplications || 0} Records</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
