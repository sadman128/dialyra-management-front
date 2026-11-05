"use client";

import React from "react";
import {
  PhoneCall,
  Volume2,
  Building2,
  Layers,
  Webhook,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 text-xs font-bold uppercase tracking-wider">
            <Zap size={14} />
            <span>Enterprise Telephony Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Engineered For Telecommunications Precision
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Everything high-volume e-commerce merchants need to eliminate COD fraud, manage multi-store voice pipelines, and bridge calls to live human agents.
          </p>
        </div>

        {/* Bento Grid Layout (Pure White surfaces + Royal Purple / Amber accents) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Bento 1: Order Sentinel (Wide 8 cols) */}
          <div className="md:col-span-8 rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 w-fit">
                  <PhoneCall size={24} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-800 text-xs font-bold border border-emerald-500/20">
                  84.2% Recovery Rate
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                Order Sentinel: Autonomous Outbound Verification
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                Automatically triggers an outbound telephony call within seconds of checkout. Customers hear their name, order summary, and price, then confirm or cancel with a single dialpad press.
              </p>
            </div>

            {/* Micro visual demonstration */}
            <div className="mt-6 pt-6 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  DTMF KEY 1
                </span>
                <span className="text-xs font-bold text-emerald-600 mt-1 block">
                  ✓ Instant Order Confirm
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  DTMF KEY 2
                </span>
                <span className="text-xs font-bold text-rose-600 mt-1 block">
                  ✗ Cancel &amp; Free Stock
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  NO ANSWER
                </span>
                <span className="text-xs font-bold text-amber-600 mt-1 block">
                  ↺ Auto 3x Staggered Retry
                </span>
              </div>
            </div>
          </div>

          {/* Bento 2: Concurrency Captain (4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-[#f0a60a] border border-amber-500/20 w-fit">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Asterisk AMI Concurrency Governor
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Prevents telecom carrier bans by dynamically queuing calls. Automatically throttles outbound dials to your SIP trunk limits without dropping connections.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs space-y-2">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Live Channels:</span>
                <span className="font-mono font-bold text-slate-900">18 / 30 Active</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#f0a60a] h-2 rounded-full w-[60%]" />
              </div>
            </div>
          </div>

          {/* Bento 3: Multi-Storefront Middleware (4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 w-fit">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Switchboard Synapse: Multi-Store Hub
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                One master account manages 10+ e-commerce brands with a single pooled balance, custom caller IDs per store, and isolated order routing rules.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Shared Balance Pool</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                ৳ 500.00 (~35.1 Days)
              </span>
            </div>
          </div>

          {/* Bento 4: Studio Voice Prompts (4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 border border-blue-500/20 w-fit">
                <Volume2 size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Studio-Quality Bengali &amp; English Audio
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Upload your brand voice prompts or utilize natural human-like Bengali &amp; English TTS. Slices dynamic variables seamlessly into the audio stream.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center gap-2 text-xs text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Crystal Clear 8kHz Telephony Audio (G.711u)</span>
            </div>
          </div>

          {/* Bento 5: Human Support Bridge (4 cols) */}
          <div className="md:col-span-4 rounded-3xl bg-slate-50/70 border border-slate-200/90 p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 w-fit">
                <Headphones size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Live Softphone Escalation
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                When a customer needs human assistance, DTMF Key 3 instantly bridges the call to your support team via MicroSIP, Linphone, or browser WebRTC.
              </p>
            </div>

            <div className="mt-6 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-xs flex items-center justify-between">
              <span className="text-slate-600 font-semibold">Queue Bridge Latency</span>
              <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                &lt; 250ms
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
