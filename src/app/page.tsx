"use client";

import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroFlowSandbox } from "@/components/landing/HeroFlowSandbox";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { RoiCalculator } from "@/components/landing/RoiCalculator";
import { FaqSection } from "@/components/landing/FaqSection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#9a55ff] selection:text-white relative overflow-x-clip">
      {/* Workspace Main Background Image (Fixed Attachment) */}
      <div
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-60"
        style={{
          backgroundImage: `url('/images/trizync-bg.png')`,
          backgroundAttachment: "fixed",
        }}
      />

      {/* 1. Sticky Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section with Pure White Canvas & Ambient Radiant Glows */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Top Announcement Chip */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-[#411264] border border-purple-500/20 text-xs sm:text-sm font-bold shadow-2xs">
              <Sparkles size={15} className="text-[#9a55ff]" />
              <span>Next-Gen Telephony Engine · FreePBX &amp; Asterisk 20.6 AMI Core</span>
            </div>

            {/* Hero Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 leading-[1.08]">
              Autonomous Telephony for High-Volume E-Commerce.
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#411264] via-[#9a55ff] to-[#f0a60a]">
                Zero Fake Orders. 100% Phone-Verified.
              </span>
            </h1>

            {/* Sub-Headline */}
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
              Dialyra triggers automated outbound IVR confirmation calls within seconds of order placement, collects keypress responses, and recovers 85% of Return-to-Origin courier losses automatically.
            </p>

            {/* Hero CTAs: Registration and Login */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-base font-black shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Registration</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white hover:bg-slate-50 text-[#411264] text-base font-bold border-2 border-purple-200 hover:border-purple-300 shadow-sm transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Login</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Micro Trust Indicators (Zero trial references) */}
            <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>Zero customer app required</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-500" />
                <span>2-minute WooCommerce &amp; Shopify setup</span>
              </span>
            </div>
          </div>

          {/* Real-Time Metrics Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">
                84.2%
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">
                Average Confirmation Rate
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono block">
                ৳ 4.8M+
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">
                Courier Fees Saved
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">
                &lt; 1.2s
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">
                SIP Connect Latency
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-xs border border-slate-200/80 shadow-2xs">
              <span className="text-2xl sm:text-3xl font-black text-purple-600 font-mono block">
                99.98%
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">
                Telephony Uptime
              </span>
            </div>
          </div>

          {/* 3. Live Interactive Sandbox Mounted in Hero */}
          <div id="sandbox" className="mt-12 scroll-mt-24">
            <HeroFlowSandbox />
          </div>
        </div>
      </section>

      {/* 4. Enterprise Feature Bento Grid */}
      <div className="relative z-10">
        <FeaturesSection />
      </div>

      {/* 5. Dynamic ROI Profitability Calculator */}
      <div className="relative z-10">
        <RoiCalculator />
      </div>

      {/* 6. Frequently Asked Questions Accordion */}
      <div className="relative z-10">
        <FaqSection />
      </div>

      {/* 7. High-Impact Bottom CTA Banner & Footer */}
      <div className="relative z-10">
        <LandingFooter />
      </div>
    </div>
  );
}
