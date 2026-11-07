"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RotateCw, ArrowLeft } from "lucide-react";
import { useToast } from "@/context/ToastContext";

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const emailParam = searchParams.get("email") || "";
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState<number>(45);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasNotifiedRef = useRef(false);

  // Auto-focus first input on mount & announce code dispatched
  useEffect(() => {
    inputRefs.current[0]?.focus();
    if (!hasNotifiedRef.current) {
      hasNotifiedRef.current = true;
      toast.info("Verification code sent (Mock: 123456)", undefined, 3000);
    }
  }, [emailParam, toast]);

  // 45-second resend countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleDigitChange = (index: number, val: string) => {
    // Only accept numeric characters
    const char = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    // Auto-advance to next input field
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setDigits(newDigits);

    // Focus last filled or next empty input
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = digits.join("");

    if (fullCode.length < 6) {
      toast.error("Please enter 6-digit code.", undefined, 3000);
      return;
    }

    setIsVerifying(true);

    // Mock verification check (mock valid code: 123456 or any 6 digits except 000000)
    setTimeout(() => {
      if (fullCode === "000000") {
        setIsVerifying(false);
        toast.error("Invalid code. Use 123456", undefined, 3000);
        return;
      }

      toast.success("OTP verified", undefined, 3000);
      router.push("/dashboard");
    }, 600);
  };

  const handleResendCode = () => {
    if (timer > 0 || isResending) return;
    setIsResending(true);

    setTimeout(() => {
      setTimer(45);
      setDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsResending(false);
      toast.info(
        "A fresh verification code has been dispatched. (Mock: 123456)",
        "Code Resent",
        3000
      );
    }, 400);
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
          Verify Account
        </h2>
        <p className="mt-1.5 text-sm text-slate-600 dark:text-zinc-400 font-medium">
          Enter the 6-digit code sent to{" "}
          <span className="font-semibold text-slate-900 dark:text-zinc-200">
            {emailParam || "your email"}
          </span>
          .
        </p>
      </div>

      {/* Minimal Hallmark OTP Verification Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 relative z-10">
        <div className="bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md py-8 px-6 sm:px-10 rounded-3xl border border-slate-200/90 dark:border-zinc-800 shadow-xl shadow-slate-200/50 dark:shadow-black/60 space-y-6">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* 6 Segmented OTP Inputs */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 text-center mb-3">
                Security code
              </label>

              <div
                className="grid grid-cols-6 gap-2 sm:gap-2.5 justify-center"
                onPaste={handlePaste}
              >
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-full aspect-square text-center text-lg sm:text-xl font-bold font-mono text-slate-900 dark:text-zinc-100 bg-slate-50 dark:bg-zinc-900/90 border border-slate-200 dark:border-zinc-700 rounded-xl focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/40 focus:border-[#9a55ff] transition"
                  />
                ))}
              </div>
            </div>

            {/* Verification Button */}
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 px-4 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{isVerifying ? "Verifying..." : "Verify & Continue"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Resend Section & Mock Helper */}
          <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-zinc-400 font-medium">
              Didn&apos;t get the code?
            </span>

            {timer > 0 ? (
              <span className="font-mono font-semibold text-slate-400 dark:text-zinc-500">
                Resend in {timer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-bold text-[#411264] dark:text-[#da8cff] hover:text-[#9a55ff] flex items-center gap-1 cursor-pointer transition"
              >
                <RotateCw size={12} className={isResending ? "animate-spin" : ""} />
                <span>Resend Code</span>
              </button>
            )}
          </div>

          {/* Discreet Mock Code Indicator */}
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/15 text-[#411264] dark:text-[#da8cff] text-[11px] font-semibold border border-purple-500/20">
              <ShieldCheck size={13} className="text-[#9a55ff]" />
              <span>Mock verification code: <strong>123456</strong></span>
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 text-center space-y-2 text-xs">
          <p>
            <Link
              href="/register"
              className="inline-flex items-center gap-1 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 font-semibold transition"
            >
              <ArrowLeft size={13} />
              <span>Back to Registration</span>
            </Link>
          </p>
          <p>
            <Link
              href="/login"
              className="text-slate-500 dark:text-zinc-500 hover:text-slate-700 dark:hover:text-zinc-300 font-medium"
            >
              Already verified? Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#09090b] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#9a55ff] border-t-transparent animate-spin" />
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
