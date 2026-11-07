"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Basic Password Filters
  const hasMinLength = password.length >= 8;
  const hasLettersAndNumbers =
    /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
  const passwordsMatch =
    Boolean(password) &&
    Boolean(confirmPassword) &&
    password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check basic password filters
    if (!hasMinLength) {
      toast.error("Password must be at least 8 characters.", undefined, 3000);
      return;
    }

    if (!hasLettersAndNumbers) {
      toast.error("Password must contain letters and numbers.", undefined, 3000);
      return;
    }

    // 2. Check if both passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", undefined, 3000);
      return;
    }

    setIsLoading(true);

    // Mock API processing before redirecting to OTP verification
    setTimeout(() => {
      toast.success("Account created. Code sent to email.", undefined, 3000);
      const queryParam = email ? `?email=${encodeURIComponent(email)}` : "";
      router.push(`/verify-otp${queryParam}`);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Workspace Main Background Image (Fixed Attachment) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-60 dark:opacity-20"
        style={{
          backgroundImage: `url('/images/trizync-bg.png')`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform">
            D
          </div>
          <div className="text-left">
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100 block leading-none">
              Dialyra
            </span>
            <span className="text-xs text-[#9a55ff] font-semibold block mt-0.5">
              Telephony Console
            </span>
          </div>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-black text-slate-900 dark:text-zinc-100 tracking-tight">
          Registration
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-zinc-400 font-medium">
          Create an account to deploy automated telephony for your business.
        </p>
      </div>

      {/* Registration Card: Clean Standard Fields with Hallmark Craft */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-black/60 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Full name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <User size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 focus:border-[#9a55ff] transition"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 focus:border-[#9a55ff] transition"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 focus:border-[#9a55ff] transition"
                  placeholder="At least 8 characters (letters & numbers)"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-zinc-300 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5"
              >
                Confirm password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-zinc-500">
                  <Lock size={16} />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-700/80 rounded-xl text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/30 focus:border-[#9a55ff] transition"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            {/* Basic Password Filters Live Checklist */}
            <div className="p-3 bg-slate-50 dark:bg-zinc-900/50 border border-slate-200/70 dark:border-zinc-800/80 rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                {hasMinLength ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-zinc-600 shrink-0" />
                )}
                <span
                  className={
                    hasMinLength
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-500 dark:text-zinc-400"
                  }
                >
                  At least 8 characters
                </span>
              </div>

              <div className="flex items-center gap-2">
                {hasLettersAndNumbers ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-zinc-600 shrink-0" />
                )}
                <span
                  className={
                    hasLettersAndNumbers
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-slate-500 dark:text-zinc-400"
                  }
                >
                  Contains letters and numbers
                </span>
              </div>

              <div className="flex items-center gap-2">
                {passwordsMatch ? (
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                ) : confirmPassword && password ? (
                  <XCircle size={13} className="text-rose-500 shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-zinc-600 shrink-0" />
                )}
                <span
                  className={
                    passwordsMatch
                      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                      : confirmPassword && password
                      ? "text-rose-500 font-semibold"
                      : "text-slate-500 dark:text-zinc-400"
                  }
                >
                  Passwords match
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isLoading ? "Validating & Creating..." : "Complete Registration"}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-2 text-xs">
          <p className="text-slate-600 dark:text-zinc-400 font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-[#411264] dark:text-[#da8cff] hover:text-[#9a55ff]"
            >
              Login
            </Link>
          </p>
          <p>
            <Link
              href="/"
              className="text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 font-semibold"
            >
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
