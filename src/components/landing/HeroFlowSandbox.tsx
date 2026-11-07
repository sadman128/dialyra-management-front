"use client";

import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  PhoneOff,
  CheckCircle2,
  XCircle,
  Volume2,
  Activity,
  Send,
  RotateCcw,
  Sparkles,
  Server,
  Radio,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

type SimStep = "idle" | "dialing" | "connected" | "confirmed" | "cancelled";

export function HeroFlowSandbox() {
  const [step, setStep] = useState<SimStep>("idle");
  const [timer, setTimer] = useState(0);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  // Call timer simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "connected") {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Handle trigger call
  const startCall = () => {
    setStep("dialing");
    setSelectedKey(null);
    setTimeout(() => {
      setStep("connected");
    }, 1800);
  };

  // Handle DTMF Keypress
  const handleKeypress = (key: string) => {
    setSelectedKey(key);
    if (key === "1") {
      setTimeout(() => {
        setStep("confirmed");
      }, 700);
    } else if (key === "2") {
      setTimeout(() => {
        setStep("cancelled");
      }, 700);
    }
  };

  const resetSim = () => {
    setStep("idle");
    setSelectedKey(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl shadow-purple-500/10 overflow-hidden relative">
      {/* Decorative top ambient bar */}
      <div className="h-2 w-full bg-gradient-to-r from-[#9a55ff] via-[#f0a60a] to-[#9a55ff]" />

      {/* Simulator Control Header */}
      <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-800">
            Live Telephony Sandbox
          </span>
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            Interactive Outbound Order Verification Flow
          </span>
        </div>

        <div className="flex items-center gap-2">
          {step !== "idle" && (
            <button
              type="button"
              onClick={resetSim}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a55ff]"
            >
              <RotateCcw size={12} />
              <span>Reset Simulation</span>
            </button>
          )}
          <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-[#9a55ff] border border-purple-500/20 text-[11px] font-bold">
            Asterisk 20.6 AMI
          </span>
        </div>
      </div>

      {/* Main 2-Column Split: Left Phone UI + Right Live Telemetry & Webhook */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
        {/* Left Column: Simulated Customer Mobile Screen (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50/50">
          <div>
            {/* Order Target Metadata Card */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs mb-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Target order #1045
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 text-[11px] font-bold">
                  Cash on Delivery
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-base font-extrabold text-slate-900">
                  Tanvir Ahmed
                </span>
                <span className="text-sm font-black text-slate-900">
                  ৳ 2,850 BDT
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center justify-between mt-1">
                <span>+880 1712-998877</span>
                <span className="truncate max-w-[150px]">Pure Mustard Oil 1L</span>
              </div>
            </div>

            {/* Mobile Device Mockup Frame */}
            <div className="w-full max-w-[320px] mx-auto rounded-3xl bg-slate-950 p-4 shadow-xl border-4 border-slate-800 text-white relative">
              {/* Device Speaker Notch */}
              <div className="w-20 h-3 bg-slate-800 rounded-full mx-auto mb-4" />

              {/* State 1: Idle (Ready to trigger) */}
              {step === "idle" && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 text-[#c084fc] flex items-center justify-center mx-auto border border-purple-500/30">
                    <PhoneCall size={28} className="animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Automated Order Call
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Ready to dispatch Asterisk outbound channel to customer
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startCall}
                    className="w-full py-3 px-4 rounded-xl bg-[#f0a60a] hover:bg-[#fbbf24] text-slate-950 text-sm font-extrabold shadow-lg shadow-amber-500/25 active:scale-95 transition-colors flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <PhoneCall size={15} />
                    <span>Trigger Verification Call</span>
                  </button>
                </div>
              )}

              {/* State 2: Dialing Ringing Animation */}
              {step === "dialing" && (
                <div className="py-8 text-center space-y-4">
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-30"></span>
                    <div className="w-16 h-16 rounded-full bg-[#9a55ff] text-white flex items-center justify-center shadow-lg shadow-purple-500/50">
                      <PhoneCall size={26} className="animate-bounce" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Dialing Customer...
                    </h4>
                    <p className="text-xs text-amber-300 font-mono mt-1">
                      SIP/trunk-01 &bull; Ringing (+8801712998877)
                    </p>
                  </div>
                  <div className="flex justify-center gap-1.5 py-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping delay-100" />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping delay-200" />
                  </div>
                </div>
              )}

              {/* State 3: Call Connected & In Progress */}
              {step === "connected" && (
                <div className="py-4 text-center space-y-3">
                  <div className="flex items-center justify-between px-2 text-xs text-emerald-400 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      CONNECTED
                    </span>
                    <span>00:{timer < 10 ? `0${timer}` : timer}</span>
                  </div>

                  {/* Pulsating Audio Waveform Visualizer */}
                  <div className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-1 h-12">
                    {[40, 75, 95, 60, 100, 85, 45, 90, 65, 80, 50, 95, 70].map(
                      (h, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-[#9a55ff] to-[#f0a60a] rounded-full transition-all duration-200"
                          style={{
                            height: `${(h * (0.4 + Math.sin(timer * 2 + i) * 0.3))}%`,
                          }}
                        />
                      )
                    )}
                  </div>

                  {/* Audio Script Prompt */}
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-[11px] text-purple-200 text-left leading-relaxed">
                    <span className="font-bold text-[#f0a60a] flex items-center gap-1.5 mb-0.5">
                      <Volume2 size={13} className="text-[#f0a60a] shrink-0" />
                      <span>Audio prompt playing:</span>
                    </span>
                    &ldquo;Press <strong>1</strong> to confirm your order, or press <strong>2</strong> to cancel.&rdquo;
                  </div>

                  {/* Interactive DTMF Keypad */}
                  <div className="pt-2">
                    <p className="text-xs text-slate-400 font-semibold mb-2">
                      Keypad selection:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleKeypress("1")}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                          selectedKey === "1"
                            ? "bg-emerald-500 text-white border-emerald-400 scale-95"
                            : "bg-slate-900 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-850"
                        }`}
                      >
                        <span className="block text-lg font-black text-emerald-400">
                          1
                        </span>
                        <span className="block text-[11px] text-emerald-300 font-medium">
                          Confirm
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleKeypress("2")}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
                          selectedKey === "2"
                            ? "bg-rose-500 text-white border-rose-400 scale-95"
                            : "bg-slate-900 border-slate-800 hover:border-rose-500/60 hover:bg-slate-850"
                        }`}
                      >
                        <span className="block text-lg font-black text-rose-400">
                          2
                        </span>
                        <span className="block text-[11px] text-rose-300 font-medium">
                          Cancel
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleKeypress("3")}
                        className={`p-3 rounded-xl border text-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                          selectedKey === "3"
                            ? "bg-amber-500 text-white border-amber-400 scale-95"
                            : "bg-slate-900 border-slate-800 hover:border-amber-500/60 hover:bg-slate-850"
                        }`}
                      >
                        <span className="block text-lg font-black text-amber-400">
                          3
                        </span>
                        <span className="block text-[11px] text-amber-300 font-medium">
                          Agent
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* State 4A: Confirmed */}
              {step === "confirmed" && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                    <CheckCircle2 size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-emerald-400">
                      Order Confirmed!
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Customer pressed DTMF <strong>Key 1</strong>
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Tagged in Storefront: <strong>ORDER_VERIFIED</strong></span>
                  </div>
                </div>
              )}

              {/* State 4B: Cancelled */}
              {step === "cancelled" && (
                <div className="py-6 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
                    <XCircle size={32} />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-rose-400">
                      Order Cancelled
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Customer pressed DTMF <strong>Key 2</strong>
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 text-[11px] text-rose-200 flex items-center justify-center gap-1.5">
                    <CheckCircle2 size={13} className="text-rose-400 shrink-0" />
                    <span>Inventory Released: <strong>৳ 120 Courier Saved</strong></span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Backend Telemetry & Webhook Dispatcher (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Server size={18} className="text-[#9a55ff]" />
                  <span>Real-Time Engine Pipeline</span>
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Latency: <strong>18ms</strong>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Watch Asterisk AMI channel state and webhook delivery execute live.
              </p>
            </div>

            {/* Pipeline Stage Badges */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  step !== "idle"
                    ? "bg-purple-50 border-purple-300 text-purple-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="block text-xs text-slate-500 font-medium">
                  Stage 1
                </span>
                <span>Ingest</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  step === "dialing" ||
                  step === "connected" ||
                  step === "confirmed" ||
                  step === "cancelled"
                    ? "bg-amber-50 border-amber-300 text-amber-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="block text-xs text-slate-500 font-medium">
                  Stage 2
                </span>
                <span>AMI Dial</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  step === "connected" ||
                  step === "confirmed" ||
                  step === "cancelled"
                    ? "bg-purple-50 border-purple-300 text-purple-900 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="block text-xs text-slate-500 font-medium">
                  Stage 3
                </span>
                <span>IVR Keypad</span>
              </div>

              <div
                className={`p-2.5 rounded-xl border transition-colors ${
                  step === "confirmed"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold"
                    : step === "cancelled"
                      ? "bg-rose-50 border-rose-300 text-rose-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-400"
                }`}
              >
                <span className="block text-xs text-slate-500 font-medium">
                  Stage 4
                </span>
                <span>Webhook</span>
              </div>
            </div>

            {/* Live Terminal Output */}
            <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-inner border border-slate-800 space-y-1.5 h-44 overflow-y-auto">
              <div className="text-slate-500 pb-1 border-b border-slate-800 flex items-center justify-between text-[11px]">
                <span>DIALYRA TELEPHONY KERNEL LOG</span>
                <span>PORT: 5060 (SIP/UDP)</span>
              </div>

              <p className="text-purple-400">
                [00:00:01] System ready. AMI Governor channels: 18/30 active.
              </p>

              {step !== "idle" && (
                <p className="text-emerald-400">
                  [00:00:02] Action: Originate(Channel=SIP/trunk-01/01712998877, Context=ivr-order-confirm)
                </p>
              )}

              {(step === "dialing" || step === "connected" || step === "confirmed" || step === "cancelled") && (
                <p className="text-amber-400">
                  [00:00:03] Event: DialStateChanged -&gt; RINGING (Trunk latency: 18ms)
                </p>
              )}

              {(step === "connected" || step === "confirmed" || step === "cancelled") && (
                <>
                  <p className="text-cyan-400">
                    [00:00:05] Event: ChannelAnswered -&gt; Playing audio: &quot;confirm_prompt_bn.wav&quot;
                  </p>
                  <p className="text-purple-300">
                    [00:00:07] Waiting for DTMF digit (timeout: 10s)...
                  </p>
                </>
              )}

              {step === "confirmed" && (
                <>
                  <p className="text-emerald-300 font-bold">
                    [00:00:09] Event: DTMFReceived -&gt; Digit: &apos;1&apos; (Duration: 140ms)
                  </p>
                  <p className="text-emerald-400">
                    [00:00:10] Dispatched Webhook: POST https://api.songsharerbazar.com/webhook (HTTP 200 OK)
                  </p>
                  <p className="text-slate-400">
                    [00:00:10] Call Cost: ৳ 1.20 BDT deducted from Multi-Store Pool.
                  </p>
                </>
              )}

              {step === "cancelled" && (
                <>
                  <p className="text-rose-300 font-bold">
                    [00:00:09] Event: DTMFReceived -&gt; Digit: &apos;2&apos; (Duration: 120ms)
                  </p>
                  <p className="text-rose-400">
                    [00:00:10] Dispatched Webhook: POST https://api.songsharerbazar.com/webhook (order: CANCELLED)
                  </p>
                  <p className="text-slate-400">
                    [00:00:10] Delivery avoided. Saved ~৳ 120 courier delivery fee.
                  </p>
                </>
              )}
            </div>

            {/* Outgoing Webhook Payload Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Send size={13} className="text-[#f0a60a]" />
                  <span>Storefront Webhook Payload (JSON)</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {step === "confirmed" ? "Status: 200 OK" : step === "cancelled" ? "Status: 200 OK" : "Pending Action"}
                </span>
              </div>
              <pre className="text-[11px] font-mono text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 overflow-x-auto">
{`{
  "order_id": 1045,
  "customer_phone": "+8801712998877",
  "verification_outcome": "${step === "confirmed" ? "CONFIRMED" : step === "cancelled" ? "CANCELLED" : step === "connected" ? "IN_CALL" : "QUEUED"}",
  "dtmf_key": ${selectedKey ? `"${selectedKey}"` : "null"},
  "duration_seconds": ${timer},
  "cost_bdt": ${step === "confirmed" || step === "cancelled" ? 1.20 : 0.00}
}`}
              </pre>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 mt-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Zero customer app required / Pure GSM voice</span>
            </span>
            <span className="font-semibold text-slate-900">
              Saves 85% of RTO losses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
