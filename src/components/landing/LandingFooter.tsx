"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-[#411264]/40 via-[#9a55ff]/10 to-transparent pointer-events-none" />

      {/* High-Impact Bottom CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
        <div className="rounded-3xl bg-gradient-to-r from-[#411264] via-[#280044] to-[#411264] border border-purple-500/30 p-8 sm:p-14 text-center shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0a60a]/20 text-[#fbbf24] border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              <span>Autonomous Telephony For E-Commerce</span>
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Stop Paying Courier Penalties for Fake Orders.
            </h2>

            <p className="text-base sm:text-lg text-purple-200">
              Join leading e-commerce merchants recovering 85% of Return-to-Origin losses with instant outbound phone verification.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-base font-black shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Registration</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-base font-bold border border-white/20 transition-all text-center"
              >
                Login
              </Link>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-purple-300">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Zero customer app required</span>
              </span>
              <span>•</span>
              <span>Pure GSM telecom audio</span>
              <span>•</span>
              <span>Instant WooCommerce &amp; Shopify integration</span>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 pb-12 border-b border-slate-800 text-sm">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#da8cff] to-[#9a55ff] flex items-center justify-center text-white font-black text-lg shadow-md shadow-purple-500/30">
                D
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Dialyra
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Autonomous Telephony Engine, Interactive IVR Keypress Verification &amp; Multi-Tenant Storefront Middleware.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Telephony Systems Operational</span>
            </div>
          </div>

          {/* Engine Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Engine Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#features" className="hover:text-white transition">Order Sentinel</a></li>
              <li><a href="#sandbox" className="hover:text-white transition">Live Sandbox Simulator</a></li>
              <li><a href="#features" className="hover:text-white transition">Concurrency Governor</a></li>
              <li><a href="#features" className="hover:text-white transition">Studio Bengali Audio</a></li>
              <li><a href="#features" className="hover:text-white transition">SIP Softphone Bridge</a></li>
            </ul>
          </div>

          {/* Navigation & Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Access
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/login" className="hover:text-white transition">Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition">Registration</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition">Console</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Micro Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Dialyra Management. Built with world-class craftsmanship.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-default">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-default">Telecom Terms</span>
            <span className="hover:text-slate-400 cursor-default">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
