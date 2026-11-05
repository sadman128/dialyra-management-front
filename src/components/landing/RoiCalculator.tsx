"use client";

import React, { useState } from "react";
import { Calculator, TrendingUp, DollarSign, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

export function RoiCalculator() {
  const [monthlyOrders, setMonthlyOrders] = useState<number>(3500);

  // Calculations based on industry benchmarks in South Asian E-commerce (COD):
  // 1. Average COD Fake/Regret order rate without automated calling: ~18%
  // 2. Average courier delivery fee lost per returned parcel (forward + reverse): ~৳ 130 BDT
  // 3. Dialyra call cost per verified order: ~৳ 1.20 BDT
  const fakeOrdersIntercepted = Math.round(monthlyOrders * 0.18);
  const deliveryFeesSaved = fakeOrdersIntercepted * 130;
  const dialyraCost = Math.round(monthlyOrders * 1.20);
  const netMonthlyProfit = deliveryFeesSaved - dialyraCost;
  const roiMultiplier = (deliveryFeesSaved / dialyraCost).toFixed(1);

  return (
    <section id="roi-calculator" className="py-20 bg-white scroll-mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
            <Calculator size={14} className="text-[#f0a60a]" />
            <span>Interactive Profit Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Calculate Your Return on Investment
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            See how much you save on non-delivery penalties and courier return fees by automating phone verification before dispatching parcels.
          </p>
        </div>

        {/* Calculator Interactive Card */}
        <div className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-6 sm:p-10 shadow-xl shadow-slate-200/50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Sliders & Store Profile (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="order-slider" className="text-sm font-bold text-slate-900">
                    Monthly Cash on Delivery Orders:
                  </label>
                  <span className="text-xl sm:text-2xl font-black font-mono text-[#411264] bg-purple-500/10 px-3.5 py-1 rounded-xl border border-purple-500/20">
                    {monthlyOrders.toLocaleString()} <span className="text-xs font-bold font-sans">orders/mo</span>
                  </span>
                </div>
                <input
                  id="order-slider"
                  type="range"
                  min={500}
                  max={25000}
                  step={250}
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#f0a60a]"
                />
                <div className="flex justify-between text-xs text-slate-400 font-mono mt-1.5">
                  <span>500 orders</span>
                  <span>10,000 orders</span>
                  <span>25,000 orders</span>
                </div>
              </div>

              {/* Assumptions & Operational Transparency */}
              <div className="space-y-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <ShieldAlert size={15} className="text-rose-500" />
                    <span>Average Return-to-Origin (RTO) Rate:</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">18.0%</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <DollarSign size={15} className="text-amber-500" />
                    <span>Courier Penalty Saved per Avoided Return:</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">৳ 130.00 BDT</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-2">
                    <Sparkles size={15} className="text-[#9a55ff]" />
                    <span>Dialyra Autonomous Call Verification Cost:</span>
                  </span>
                  <span className="font-bold text-slate-900 font-mono">৳ 1.20 BDT / call</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Savings Results (6 cols) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-[#411264] to-[#280044] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              {/* Subtle decorative glow */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#f0a60a]/20 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                    Estimated Net Monthly Savings
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#f0a60a] text-slate-950 font-black text-xs">
                    {roiMultiplier}x ROI
                  </span>
                </div>

                <div>
                  <div className="text-4xl sm:text-5xl font-black tracking-tight text-[#fbbf24] font-mono">
                    ৳ {netMonthlyProfit.toLocaleString()} <span className="text-lg font-sans font-bold text-white">BDT</span>
                  </div>
                  <p className="text-xs text-purple-200 mt-1">
                    Direct monthly profit added straight to your bottom line.
                  </p>
                </div>

                {/* Sub-Metrics Breakdown */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-purple-800/80">
                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase font-bold text-purple-300 block">
                      Returned Parcels Stopped
                    </span>
                    <span className="text-xl font-bold font-mono text-white mt-0.5 block">
                      {fakeOrdersIntercepted.toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
                    <span className="text-[10px] uppercase font-bold text-purple-300 block">
                      Courier Fees Prevented
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-300 mt-0.5 block">
                      ৳ {deliveryFeesSaved.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-purple-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <span className="text-xs text-purple-200 font-medium">
                  Verification engine pays for itself in <strong>under 48 hours</strong>.
                </span>
                <a
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
