"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowLeft, 
  ShieldAlert,
  Loader2,
  Users,
  GraduationCap,
  Briefcase,
  School,
  Building,
  Award,
  Phone,
  KeyRound,
  CheckCircle2
} from "lucide-react";

type MockAccount = {
  role: string;
  email: string;
  pass: string;
  label: string;
  icon: React.ComponentType<any>;
};

const MOCK_ACCOUNTS: MockAccount[] = [
  { role: "SUPER_ADMIN", email: "admin@matha.edu", pass: "admin123", label: "Super Admin", icon: School },
  { role: "COLLEGE_ADMIN", email: "college@matha.edu", pass: "college123", label: "College Admin", icon: School },
  { role: "PLACEMENT_OFFICER", email: "placement@matha.edu", pass: "placement123", label: "Placement Officer", icon: Briefcase },
  { role: "FACULTY", email: "faculty@matha.edu", pass: "faculty123", label: "Faculty Profile", icon: GraduationCap },
  { role: "AGENCY", email: "agency@matha.edu", pass: "agency123", label: "Training Agency", icon: Award },
  { role: "RECRUITER", email: "recruiter@google.com", pass: "recruiter123", label: "Recruiter", icon: Users },
  { role: "EMPLOYER", email: "employer@google.com", pass: "employer123", label: "Employer Profile", icon: Building },
  { role: "STUDENT", email: "student@matha.edu", pass: "student123", label: "Student Profile", icon: GraduationCap },
];

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"credentials" | "otp">("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      let result;
      
      if (activeTab === "credentials") {
        result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });
      } else {
        if (otp !== "1234") {
          setError("Invalid verification code. Use '1234' for evaluation.");
          setLoading(false);
          return;
        }
        result = await signIn("credentials", {
          email: "student@matha.edu",
          password: "student123",
          redirect: false,
        });
      }

      if (result?.error) {
        setError("Sign in failed. Check your credentials or try another profile.");
      } else {
        setSuccess("Login successful! Loading dashboard...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected authentication error occurred.");
    } finally {
      if (activeTab === "credentials") setLoading(false);
    }
  };

  const handleSendOtp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!phone) {
      setError("Please input a valid mobile number.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setSuccess("OTP sent to your device! (Code: 1234)");
      setLoading(false);
    }, 1000);
  };

  const autofill = (acc: MockAccount) => {
    setActiveTab("credentials");
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[150px] pointer-events-none" />

      {/* Floating particles background mockup */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Left Column: Institutional Info */}
      <div className="w-full md:w-[40%] p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 bg-slate-100/40 dark:bg-slate-900/20 backdrop-blur-md relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all mb-8 md:mb-0"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>

        <div className="my-auto py-10 md:py-0">
          <img src="/logo.png" alt="MATHA Logo" className="h-10 w-auto object-contain mb-6" />
          <h1 className="text-3xl font-extrabold tracking-tight">
            MATHA Educational{" "}
            <span className="bg-gradient-to-r from-amber-500 via-indigo-500 to-purple-500 dark:from-amber-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Society
            </span>
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed font-medium">
            LMS & Student Progress Portal. Empowering career readiness, outcome verification, and structured academic tracking.
          </p>

          <div className="mt-8 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-700 dark:text-slate-300 leading-normal font-medium">
              <span className="font-semibold block mb-0.5 text-amber-600 dark:text-amber-400">Mock Profile Access Portal</span>
              Click any mock credentials button to auto-fill. You can also log in using a mock Student ID format like <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">MATHA-STUDENT-001</span>.
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 hidden md:block">
          © 2026 MATHA Educational Society. All rights reserved.
        </p>
      </div>

      {/* Right Column: Glassmorphic Forms & Autofill */}
      <div className="flex-1 p-4 sm:p-8 md:p-12 flex flex-col justify-center items-center relative z-10 overflow-y-auto">
        <div className="w-full max-w-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Login Card (Left sub-col) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-xl relative overflow-hidden glass">
              
              {/* Tab Selector */}
              <div className="flex border-b border-slate-200 dark:border-white/5 mb-6">
                <button
                  onClick={() => { setActiveTab("credentials"); setError(""); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    activeTab === "credentials" 
                      ? "border-b-2 border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400" 
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  ID / Password
                </button>
                <button
                  onClick={() => { setActiveTab("otp"); setError(""); }}
                  className={`flex-1 pb-3 text-xs font-bold uppercase tracking-wider text-center transition-all ${
                    activeTab === "otp" 
                      ? "border-b-2 border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400" 
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  OTP Log
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 rounded-xl border border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                {activeTab === "credentials" ? (
                  <>
                    <div>
                      <label htmlFor="login-id" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                        Email Address or Student ID
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="login-id"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="student@matha.edu or MATHA-STUDENT"
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="login-pass" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          id="login-pass"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label htmlFor="login-phone" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                        Mobile Number
                      </label>
                      <div className="relative flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="login-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            placeholder="+91 99999 99999"
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                          />
                        </div>
                        {!otpSent && (
                          <button
                            onClick={handleSendOtp}
                            type="button"
                            className="px-4 py-2.5 rounded-xl border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-xs hover:bg-amber-500/5 transition-all shrink-0"
                          >
                            Send OTP
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div>
                        <label htmlFor="login-otp" className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                          Verification Code
                        </label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            id="login-otp"
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter 1234"
                            maxLength={4}
                            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all duration-200"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:shadow-lg hover:shadow-indigo-600/25 hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none mt-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>
            </div>

            {/* Autofill Panels (Right sub-col) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider pl-1">
                Autofill Credentials
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
                {MOCK_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    onClick={() => autofill(acc)}
                    className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-white/10 text-left transition-all duration-200 group hover:border-amber-500/25"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-200">
                      <acc.icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="block text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                        {acc.label}
                      </span>
                      <span className="block text-[9px] text-slate-500 dark:text-slate-400 truncate">
                        {acc.email}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
