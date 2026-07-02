"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Upload, 
  ClipboardList, 
  Clock, 
  Check, 
  ArrowRight, 
  MapPin, 
  Briefcase, 
  Award,
  Loader2,
  FileText,
  Compass,
  GraduationCap,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

type Question = {
  id: string;
  text: string;
  options: {
    text: string;
    type: "V" | "A" | "R" | "K";
  }[];
};

const VARK_QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "When learning to use a new software package, what would you prefer to do?",
    options: [
      { text: "Look at slides, screenshots, or diagram layouts.", type: "V" },
      { text: "Listen to an instructor explain it or ask questions.", type: "A" },
      { text: "Read the written instructions or online manuals.", type: "R" },
      { text: "Get hands-on and try using it straight away.", type: "K" }
    ]
  },
  {
    id: "q2",
    text: "You are planning a vacation trip for your family. How would you choose the destination?",
    options: [
      { text: "Look at photos, brochures, and maps of scenic sights.", type: "V" },
      { text: "Ask friends or a travel agent for their advice.", type: "A" },
      { text: "Read travel blogs, reviews, and itineraries.", type: "R" },
      { text: "Go to a travel expo and experience sample activities.", type: "K" }
    ]
  },
  {
    id: "q3",
    text: "If you have to build or assemble flat-pack furniture, you would:",
    options: [
      { text: "Look at the visual diagrams and step pictures.", type: "V" },
      { text: "Call a friend who has built it or listen to video guides.", type: "A" },
      { text: "Read the printed textual instructions carefully.", type: "R" },
      { text: "Start connecting pieces immediately and adjust as you go.", type: "K" }
    ]
  },
  {
    id: "q4",
    text: "When describing a complex technical system to someone, you would prefer to:",
    options: [
      { text: "Draw a flowchart or outline the blocks on paper.", type: "V" },
      { text: "Explain it verbally or discuss the concepts.", type: "A" },
      { text: "Write out a detailed summary email or doc.", type: "R" },
      { text: "Demonstrate it live or build a quick prototype.", type: "K" }
    ]
  },
  {
    id: "q5",
    text: "Which of these websites would you find most interesting or educational?",
    options: [
      { text: "Websites with rich graphs, data visualizations, and infographs.", type: "V" },
      { text: "Websites hosting tech podcasts, audio lectures, or group chats.", type: "A" },
      { text: "Websites with articles, textbooks, and code listings.", type: "R" },
      { text: "Websites with interactive simulations, coding boxes, and games.", type: "K" }
    ]
  },
  {
    id: "q6",
    text: "When trying to recall something (e.g. a phone number or quote), you recall best by:",
    options: [
      { text: "Visualizing the page, document, or card where you saw it.", type: "V" },
      { text: "Hearing the sound of the voice saying it in your head.", type: "A" },
      { text: "Recalling the text or spelling of the words.", type: "R" },
      { text: "Remembering writing it down or typing it on your keyboard.", type: "K" }
    ]
  },
  {
    id: "q7",
    text: "In a class or lecture, you learn most effectively from:",
    options: [
      { text: "Slides, charts, videos, and graphic slides.", type: "V" },
      { text: "Discussions, verbal Q&As, and seminars.", type: "A" },
      { text: "Handouts, textbooks, and taking written notes.", type: "R" },
      { text: "Labs, workshops, hands-on tasks, and models.", type: "K" }
    ]
  },
  {
    id: "q8",
    text: "You want to learn how to cook a new dish. What would you do?",
    options: [
      { text: "Look at visual recipe pictures and plating ideas.", type: "V" },
      { text: "Listen to a cooking podcast or talk to a chef.", type: "A" },
      { text: "Read a recipe book detailing the measurements.", type: "R" },
      { text: "Go to the kitchen and start mixing ingredients.", type: "K" }
    ]
  },
  {
    id: "q9",
    text: "When choosing a course, which of the following is most important to you?",
    options: [
      { text: "The layout of graphic study plans, videos, and maps.", type: "V" },
      { text: "The speaking ability and interactive tone of the lecturers.", type: "A" },
      { text: "The reading materials, documentation, and references.", type: "R" },
      { text: "The lab sessions, field works, and practical projects.", type: "K" }
    ]
  },
  {
    id: "q10",
    text: "If you are struggling to write a coding function, you would rather:",
    options: [
      { text: "Draw a flowchart of the logic on a whiteboard.", type: "V" },
      { text: "Discuss the logic with a peer or ask a teacher.", type: "A" },
      { text: "Read documentation libraries and StackOverflow pages.", type: "R" },
      { text: "Write small test scripts and debug the outputs.", type: "K" }
    ]
  }
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  
  const [profile, setProfile] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1 Profile states
  const [address, setAddress] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [skillsInput, setSkillsInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Step 2 Document states
  const [resumeName, setResumeName] = useState("");
  const [aadhaarName, setAadhaarName] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [certificatesList, setCertificatesList] = useState<string[]>([]);

  // Step 3 VARK states
  const [varkAnswers, setVarkAnswers] = useState<Record<string, "V" | "A" | "R" | "K">>({});
  const [varkResult, setVarkResult] = useState<any>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/student/profile-info"); // We can fetch from session / user endpoint
      const resData = await res.json();
      if (!res.ok) throw new Error();
      
      setProfile(resData.profile);
      setStep(resData.profile?.onboardingStep || 1);
      
      // Seed details if they exist
      setAddress(resData.profile?.address || "");
      if (resData.profile?.careerInterests) {
        setInterests(JSON.parse(resData.profile.careerInterests));
      }
      if (resData.profile?.skills) {
        setSkills(JSON.parse(resData.profile.skills));
      }
      
      // If student is already fully onboarded, redirect to active dashboard
      if (resData.profile?.isOnboarded && resData.profile?.verificationStatus === "APPROVED") {
        router.push("/dashboard");
      }
    } catch {
      // Fallback local fetch logic using direct endpoint or session
      const mockRes = await fetch("/api/notifications"); // ping endpoint just to verify auth
      if (mockRes.status === 401) router.push("/auth/login");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError("");

    try {
      const res = await fetch("/api/student/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 1,
          address,
          careerInterests: interests,
          skills
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save profile");

      setStep(2);
      setSuccess("Profile details saved! Proceed to document uploads.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeName || !aadhaarName) {
      setError("Please input file names for Aadhaar and Resume.");
      return;
    }
    setSubmitLoading(true);
    setError("");

    try {
      const res = await fetch("/api/student/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 2,
          resumeName,
          aadhaarName,
          certificatesNames: certificatesList
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to save documents");

      setStep(3);
      setSuccess("Documents registered! Start the VARK learning style assessment.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSaveStep3 = async () => {
    if (Object.keys(varkAnswers).length < VARK_QUESTIONS.length) {
      setError("Please answer all questions before submitting.");
      return;
    }
    setSubmitLoading(true);
    setError("");

    // Calculate VARK counts
    let V = 0, A = 0, R = 0, K = 0;
    Object.values(varkAnswers).forEach((type) => {
      if (type === "V") V++;
      if (type === "A") A++;
      if (type === "R") R++;
      if (type === "K") K++;
    });

    const total = V + A + R + K;
    const scores = {
      V: Math.round((V / total) * 100),
      A: Math.round((A / total) * 100),
      R: Math.round((R / total) * 100),
      K: Math.round((K / total) * 100),
    };

    setVarkResult(scores);

    try {
      const res = await fetch("/api/student/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 3,
          answers: varkAnswers,
          scores
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Failed to submit assessment");

      // Celebrate
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setStep(4);
      setSuccess("VARK learning assessment completed! Your profile is under review.");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleAutoApprove = async () => {
    setSubmitLoading(true);
    setError("");

    try {
      const res = await fetch("/api/student/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step: 4,
          approve: true
        })
      });
      const resData = await res.json();
      if (!res.ok) throw new Error();

      setSuccess("Mock Approval success! Redirecting to Dashboard...");
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1000);
    } catch {
      setError("Failed to auto-approve mock student profile.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const addInterest = () => {
    if (interestsInput.trim() && !interests.includes(interestsInput.trim())) {
      setInterests(prev => [...prev, interestsInput.trim()]);
      setInterestsInput("");
    }
  };

  const addSkill = () => {
    if (skillsInput.trim() && !skills.includes(skillsInput.trim())) {
      setSkills(prev => [...prev, skillsInput.trim()]);
      setSkillsInput("");
    }
  };

  const addCertificate = () => {
    if (certificateName.trim() && !certificatesList.includes(certificateName.trim())) {
      setCertificatesList(prev => [...prev, certificateName.trim()]);
      setCertificateName("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          <span className="text-sm font-semibold text-muted-foreground">Loading onboarding session...</span>
        </div>
      </div>
    );
  }

  const getProgressPercentage = () => {
    switch (step) {
      case 1: return 25;
      case 2: return 50;
      case 3: return 75;
      case 4: return 100;
      default: return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Progress Card */}
      <div className="w-full max-w-4xl space-y-6 z-10">
        
        {/* Step Head Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-6 rounded-3xl shadow-lg glass">
          <div>
            <h1 className="text-2xl font-extrabold flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-500 animate-spin-slow" />
              <span>Student Onboarding Progress</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Guided profile configuration for MATHA Educational Trust.</p>
          </div>

          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-bold text-indigo-400">
              <span>Overall Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {error && (
          <div className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive text-xs flex items-center gap-2 shadow animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-4 rounded-2xl border border-green-500/20 bg-green-500/5 text-green-400 text-xs flex items-center gap-2 shadow">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* STEP PANELS SWITCH */}
        <div className="min-h-[400px]">
          
          {/* STEP 1: Complete Profile */}
          {step === 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span>Step 1: Complete Your Profile (25%)</span>
              </h2>
              
              <form onSubmit={handleSaveStep1} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground">Permanent / Local Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4.5 h-4.5 text-muted-foreground" />
                    <textarea
                      rows={2}
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter house number, street name, city, state, pincode"
                      className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Career Interests Tag Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block">Career Interests</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Web Development"
                        value={interestsInput}
                        onChange={(e) => setInterestsInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
                        className="flex-1 px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addInterest}
                        className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-bold rounded-xl text-xs"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {interests.map((int, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold flex items-center gap-1.5 text-foreground">
                          <span>{int}</span>
                          <button type="button" onClick={() => setInterests(interests.filter(item => item !== int))} className="text-muted-foreground hover:text-foreground font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Skills Tag Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground block">Technical Skills</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. React"
                        value={skillsInput}
                        onChange={(e) => setSkillsInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                        className="flex-1 px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="px-3 py-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-bold rounded-xl text-xs"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {skills.map((sk, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-muted text-[10px] font-bold flex items-center gap-1.5 text-foreground">
                          <span>{sk}</span>
                          <button type="button" onClick={() => setSkills(skills.filter(item => item !== sk))} className="text-muted-foreground hover:text-foreground font-bold">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-border/40">
                  <button
                    type="submit"
                    disabled={submitLoading || !address || skills.length === 0}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue Setup</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 2: Upload Documents */}
          {step === 2 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6"
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-500" />
                <span>Step 2: Upload Documents (50%)</span>
              </h2>

              <form onSubmit={handleSaveStep2} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 border border-border bg-muted/15 rounded-2xl space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Aadhaar Verification Doc</span>
                    <p className="text-[11px] text-muted-foreground">Input file name to simulate uploading Aadhaar Card PDF.</p>
                    <input
                      type="text"
                      required
                      placeholder="e.g. aadhaar_satya.pdf"
                      value={aadhaarName}
                      onChange={(e) => setAadhaarName(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none mt-2"
                    />
                  </div>

                  <div className="p-5 border border-border bg-muted/15 rounded-2xl space-y-2">
                    <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Professional Resume</span>
                    <p className="text-[11px] text-muted-foreground">Input file name to simulate uploading your resume document.</p>
                    <input
                      type="text"
                      required
                      placeholder="e.g. resume_satya.pdf"
                      value={resumeName}
                      onChange={(e) => setResumeName(e.target.value)}
                      className="w-full px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none mt-2"
                    />
                  </div>
                </div>

                <div className="p-5 border border-border bg-muted/15 rounded-2xl space-y-3">
                  <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Certificates (Optional)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BTech_Sem5_Marksheet.pdf"
                      value={certificateName}
                      onChange={(e) => setCertificateName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCertificate())}
                      className="flex-1 px-4 py-2 text-xs rounded-xl border border-border bg-background focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCertificate}
                      className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-bold rounded-xl text-xs"
                    >
                      Attach
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {certificatesList.map((cert, i) => (
                      <span key={i} className="px-2.5 py-1 rounded bg-muted text-[10px] font-bold flex items-center gap-1.5 text-foreground">
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{cert}</span>
                        <button type="button" onClick={() => setCertificatesList(certificatesList.filter(item => item !== cert))} className="text-muted-foreground font-bold">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading || !resumeName || !aadhaarName}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Attaching files...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to VARK</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 3: VARK Learning Questionnaire */}
          {step === 3 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-6"
            >
              <div className="border-b border-border pb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-indigo-500" />
                  <span>Step 3: VARK Learning Styles Questionnaire (75%)</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Discover how you process information best (Visual, Auditory, Reading, or Kinesthetic learning style).
                </p>
              </div>

              {/* Questionnaire list */}
              <div className="space-y-8 max-h-[50vh] overflow-y-auto pr-2">
                {VARK_QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="space-y-3">
                    <span className="text-xs font-bold text-indigo-400">Question {idx + 1} of {VARK_QUESTIONS.length}</span>
                    <p className="text-sm font-semibold">{q.text}</p>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {q.options.map((opt, oidx) => {
                        const isSelected = varkAnswers[q.id] === opt.type;
                        return (
                          <button
                            key={oidx}
                            type="button"
                            onClick={() => setVarkAnswers(prev => ({ ...prev, [q.id]: opt.type }))}
                            className={`p-3 rounded-xl border text-left text-xs font-medium transition-all duration-200 ${
                              isSelected 
                                ? "bg-indigo-500/10 border-indigo-500 text-indigo-400" 
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <span className="font-extrabold mr-2 uppercase">{opt.type}</span> {opt.text}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-6 border-t border-border/40 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-border rounded-xl text-xs font-bold hover:bg-muted"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveStep3}
                  disabled={submitLoading || Object.keys(varkAnswers).length < VARK_QUESTIONS.length}
                  className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Scoring answers...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Assessment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Under Review Verification */}
          {step === 4 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-card border border-border p-8 rounded-3xl shadow-xl space-y-8 text-center"
            >
              <div className="space-y-3">
                <Clock className="w-16 h-16 text-indigo-500 mx-auto animate-pulse" />
                <h2 className="text-2xl font-extrabold">Step 4: Profile Under Review (100%)</h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your onboarding credentials, VARK scores, and Aadhaar files have been submitted successfully to the MATHA Educational Trust dashboard.
                </p>
              </div>

              {/* VARK Score Display If present */}
              {varkResult && (
                <div className="max-w-md mx-auto p-5 rounded-2xl border border-indigo-500/25 bg-indigo-500/5 space-y-4">
                  <h4 className="font-bold text-sm text-indigo-400">Your VARK Learning Profile</h4>
                  <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                    {[
                      { label: "Visual (V)", val: varkResult.V, color: "bg-indigo-500" },
                      { label: "Auditory (A)", val: varkResult.A, color: "bg-cyan-500" },
                      { label: "Read/Write (R)", val: varkResult.R, color: "bg-purple-500" },
                      { label: "Kinesthetic (K)", val: varkResult.K, color: "bg-pink-500" },
                    ].map((val, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="block text-lg font-extrabold text-foreground">{val.val}%</span>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full ${val.color}`} style={{ width: `${val.val}%` }} />
                        </div>
                        <span className="block text-[9px] text-muted-foreground font-semibold uppercase">{val.label.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline Status */}
              <div className="max-w-md mx-auto space-y-4 text-left pt-4">
                <span className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 text-center">
                  Verification Timeline
                </span>
                
                {[
                  { label: "Personal profile registered", date: "Just now", ok: true },
                  { label: "Document attachments verified", date: "Pending cell approval", ok: false },
                  { label: "VARK evaluation scored", date: "Processed successfully", ok: true },
                ].map((node, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white ${
                      node.ok ? "bg-indigo-600" : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {node.ok ? <Check className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <span className="block text-xs font-bold">{node.label}</span>
                      <span className="block text-[10px] text-muted-foreground">{node.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* MOCK BYPASS TRIGGER */}
              <div className="pt-8 border-t border-border/40 max-w-sm mx-auto space-y-3">
                <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Evaluation Action</span>
                <button
                  onClick={handleAutoApprove}
                  disabled={submitLoading}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Approving Profile...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Auto Approve Profile (LMS Access)</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
