"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-black text-xl shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
            D
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-slate-900 leading-none">
              Dialyra
            </span>
            <span className="text-xs text-[#9a55ff] font-semibold mt-0.5">
              Telephony Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="text-sm font-semibold text-slate-600 hover:text-[#9a55ff] transition-colors"
          >
            Features
          </a>
          <a
            href="#sandbox"
            className="text-sm font-semibold text-slate-600 hover:text-[#9a55ff] transition-colors"
          >
            Live Simulator
          </a>
          <a
            href="#roi-calculator"
            className="text-sm font-semibold text-slate-600 hover:text-[#9a55ff] transition-colors"
          >
            ROI Calculator
          </a>
          <a
            href="#faq"
            className="text-sm font-semibold text-slate-600 hover:text-[#9a55ff] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Top-Right Actions: Strictly Login and Registration */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-[#411264] hover:bg-slate-100 rounded-xl transition-all"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-sm font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            <span>Registration</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 rounded-xl bg-[#f0a60a] text-slate-950 text-xs font-black shadow-xs"
          >
            Register
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#sandbox"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Live Simulator
            </a>
            <a
              href="#roi-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              ROI Calculator
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-semibold text-slate-800 px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              FAQ
            </a>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="w-full text-center py-2.5 text-sm font-bold text-slate-700 bg-slate-100 rounded-xl"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="w-full text-center py-2.5 text-sm font-black text-slate-950 bg-[#f0a60a] rounded-xl shadow-md shadow-amber-500/20"
            >
              Registration →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
