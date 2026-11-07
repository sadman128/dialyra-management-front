"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Wrench,
  ChevronRight,
  PhoneCall,
  Send,
  Copy,
  Trash2,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Info,
} from "lucide-react";

export default function TestToolsPage() {
  const { accountBalance, showToast } = useBusiness();
  const [testPhone, setTestPhone] = useState("+880 1720 128825");
  const [testFlow, setTestFlow] = useState("Order Confirmation Flow (v1.4)");
  const [testCustomerName, setTestCustomerName] = useState("Rahim Uddin");
  const [testOrderId, setTestOrderId] = useState("TEST-9901");
  const [testOrderTotal, setTestOrderTotal] = useState("1,500 BDT");
  const [callProgress, setCallProgress] = useState<string[]>([]);
  const [calling, setCalling] = useState(false);
  const [callConfirmOpen, setCallConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);

  const presetWooCommerce = JSON.stringify(
    {
      order_id: "999",
      customer_name: "Rahim Uddin",
      phone: "+8801720128825",
      currency: "BDT",
      total_amount: "1500.00",
      payment_method: "cod",
      items: [{ id: 101, name: "Organic Honey 500g", quantity: 2, price: 750 }],
    },
    null,
    2
  );

  const presetShopify = JSON.stringify(
    {
      order_id: "1045",
      customer_name: "Tanvir Ahmed",
      phone: "+8801712998877",
      currency: "BDT",
      total_amount: "2850.00",
      payment_method: "cod",
      items: [{ id: 204, name: "Cotton Casual Panjabi (L)", quantity: 1, price: 2850 }],
    },
    null,
    2
  );

  const [webhookPayload, setWebhookPayload] = useState(presetWooCommerce);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);
  const [webhookLoading, setWebhookLoading] = useState(false);

  const handleDialTest = () => {
    setCalling(true);
    setCallProgress([
      "POST /api/v3/runtime/calls/originate (Auth: X-Dialyra-Access-Token)",
      `Payload: { phone: "${testPhone.replace(/\\s+/g, '')}", flow_id: 104, webhook_variables: { customer_name: "${testCustomerName}", order_id: "${testOrderId}", order_total: "${testOrderTotal}" } }`,
      "Dialyra Engine: HTTP 200 OK | session_id: 170 | action_id: 102bae32-7661",
      "PJSIP AMI Channel: PJSIP/dialyra_b1_t20_trizync_ep/sip:+8801720128825@202.40.176.2",
    ]);

    setTimeout(() => {
      setCallProgress((p) => [...p, "Phone ringing (SIP 180 Ringing)..."]);
    }, 700);

    setTimeout(() => {
      setCallProgress((p) => [
        ...p,
        `Call answered (SIP 200 OK). Google Cloud TTS playing for ${testCustomerName}...`,
      ]);
    }, 1500);

    setTimeout(() => {
      setCallProgress((p) => [...p, "DTMF Keypad Detected: Key '1' pressed by customer."]);
    }, 2400);

    setTimeout(() => {
      setCallProgress((p) => [
        ...p,
        `Order #${testOrderId} confirmed in Dialyra middleware. Call completed in 32s. Trunk released. Billed: ৳ 1.20 BDT.`,
      ]);
      setCalling(false);
      showToast("Manual test call completed successfully via v3 engine!", "success");
    }, 3200);
  };

  const handleSendWebhook = () => {
    setWebhookLoading(true);
    setTimeout(() => {
      setWebhookLoading(false);
      setWebhookResponse(
        JSON.stringify(
          {
            success: true,
            status: "queued",
            order_id: "999",
            queue_position: 1,
            ingestion_latency_ms: 38,
            signature_verified: true,
            trunk_assigned: "Trunk #20 (Asterisk Primary)",
          },
          null,
          2
        )
      );
      showToast("Simulated webhook ingested: HTTP 200 OK", "success");
    }, 600);
  };

  const clearLogs = () => {
    setCallProgress([]);
    setWebhookResponse(null);
    showToast("Telemetry console logs cleared", "info");
  };

  return (
    <div className="flex flex-col w-full space-y-6 pb-16">
      {/* 1. Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 mb-1">
            <span>Dashboard</span>
            <ChevronRight size={13} />
            <span className="text-[#9a55ff] font-bold">Test Tools</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Wrench size={20} />
            </span>
            Test Tools
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 font-medium">
            Simulate outbound calls and test webhook payloads.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2.5">
          <span className="badge-inverse-success flex items-center gap-1.5 py-1 px-3 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Sandbox Active
          </span>
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-[#121215] hover:bg-surface-container text-on-surface text-xs sm:text-sm font-bold shadow-2xs transition-colors border border-outline-variant/30 dark:border-zinc-800/80 active:scale-95 cursor-pointer"
            title="Clear logs"
            type="button"
          >
            <Trash2 size={14} className="text-rose-500" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* 2. Signature Metric Cards (Pure White in Light, Dark Grey in Dark, Purple Half Circle Watermark) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Metric 1: Voice Trunk */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              Voice trunk
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center text-[#9a55ff] dark:text-[#c084fc]">
              <Server size={15} />
            </span>
          </div>
          <div className="mt-1.5 z-10">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">BD-02</span>
              <span className="text-[10px] font-semibold text-purple-800 dark:text-purple-200 bg-purple-500/15 dark:bg-purple-500/25 px-2 py-0.5 rounded-full border border-purple-500/20">
                Primary
              </span>
            </div>
            <div className="text-[11px] text-gray-700 dark:text-zinc-400 font-medium mt-0.5">
              SIP trunk / 5 channels online
            </div>
          </div>
        </div>

        {/* Metric 2: Telecom Latency */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              Media latency
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity size={15} />
            </span>
          </div>
          <div className="mt-1.5 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              18ms
            </div>
            <div className="text-[11px] text-gray-700 dark:text-zinc-400 font-medium mt-0.5">
              Zero jitter / Local PSTN gateway
            </div>
          </div>
        </div>

        {/* Metric 3: Account Balance */}
        <div className="card-img-holder bg-white dark:bg-[#141417] text-gray-950 dark:text-zinc-100 py-2.5 px-3.5 sm:py-3 sm:px-4 rounded-xl border border-gray-200/90 dark:border-zinc-800/80 shadow-xs relative overflow-hidden flex flex-col justify-between transition-transform hover:-translate-y-0.5">
          <div className="flex items-center justify-between z-10">
            <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300">
              Account balance
            </span>
            <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 dark:bg-sky-500/20 flex items-center justify-center text-blue-600 dark:text-sky-400 text-xs font-bold">
              ৳
            </span>
          </div>
          <div className="mt-1.5 z-10">
            <div className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white tracking-tight">
              ৳ {accountBalance.toFixed(2)}
            </div>
            <div className="text-[11px] text-gray-700 dark:text-zinc-400 font-medium mt-0.5">
              Shared telecom balance pool
            </div>
          </div>
        </div>
      </div>

      {/* 3. Diagnostic Testing Consoles: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: Outbound Test Dialing */}
        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-primary" />
                <h2 className="text-base sm:text-lg text-on-surface font-bold">
                  Outbound Test Call Simulator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                Originate a real phone call to verify TTS voice and DTMF detection.
              </p>
            </div>
            <span className="badge-inverse-info shrink-0 self-start sm:self-auto text-xs font-bold">
              Outbound Dispatcher
            </span>
          </div>

          {/* Form Body */}
          <div className="p-5 flex flex-col gap-4">
            {/* Field 1: Destination Phone Number */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  Destination Phone Number
                </label>
                <span className="text-xs text-on-surface-variant font-mono">E.164 Format</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-on-surface-variant flex items-center gap-1 select-none pointer-events-none">
                  <PhoneCall size={16} />
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface">
                    +880
                  </span>
                </span>
                <input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full pl-24 pr-4 py-2.5 bg-surface-container-low rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:bg-white dark:focus:bg-[#18181b] focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 transition-all border border-outline-variant/30 font-mono font-bold"
                  type="text"
                />
              </div>
              <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                <Info size={13} className="text-[#9a55ff] shrink-0" />
                <span>Reachable Bangladesh mobile number for live test.</span>
              </p>
            </div>

            {/* Field 2 & 3: Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  Select Call Flow
                </label>
                <div className="relative">
                  <select
                    value={testFlow}
                    onChange={(e) => setTestFlow(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 transition-all border border-outline-variant/30 font-semibold appearance-none pr-8 cursor-pointer"
                  >
                    <option>Order Confirmation Flow (v1.4)</option>
                    <option>VIP Verification Flow (v2.1)</option>
                    <option>Grocery Express Flow (v2.1)</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  Voice Trunk
                </label>
                <div className="relative">
                  <select className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 transition-all border border-outline-variant/30 font-semibold appearance-none pr-8 cursor-pointer">
                    <option>Trunk #20 (Asterisk Primary)</option>
                    <option>Trunk #21 (Backup Trunk)</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dynamic Webhook Variables (v3 API Match) */}
            <div className="p-3.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/30 space-y-2">
              <span className="text-xs font-semibold text-[#9a55ff] block">
                Runtime Webhook Variables (<code>webhook_variables</code>)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                    customer_name
                  </label>
                  <input
                    type="text"
                    value={testCustomerName}
                    onChange={(e) => setTestCustomerName(e.target.value)}
                    className="w-full bg-white dark:bg-[#18181b] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-outline-variant/30 dark:border-zinc-800 text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                    order_id
                  </label>
                  <input
                    type="text"
                    value={testOrderId}
                    onChange={(e) => setTestOrderId(e.target.value)}
                    className="w-full bg-white dark:bg-[#18181b] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-outline-variant/30 dark:border-zinc-800 text-on-surface focus:outline-none focus:border-[#9a55ff] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-on-surface-variant mb-0.5">
                    order_total
                  </label>
                  <input
                    type="text"
                    value={testOrderTotal}
                    onChange={(e) => setTestOrderTotal(e.target.value)}
                    className="w-full bg-white dark:bg-[#18181b] px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-outline-variant/30 dark:border-zinc-800 text-on-surface focus:outline-none focus:border-[#9a55ff]"
                  />
                </div>
              </div>
            </div>

            {/* Dial Button */}
            <button
              onClick={() => setCallConfirmOpen(true)}
              disabled={calling}
              className="w-full py-3 px-4 rounded-full btn-gradient-primary text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer"
              type="button"
            >
              <PhoneCall
                size={16}
                className={calling ? "animate-bounce" : ""}
              />
              <span>{calling ? "Calling Phone..." : "Make Test Call"}</span>
            </button>

            {/* Live Console Output */}
            {callProgress.length > 0 && (
              <div className="p-3.5 rounded-xl bg-[#09090b] text-purple-100 font-mono text-xs space-y-1.5 border border-zinc-800 shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-zinc-800 text-purple-400">
                  <span className="text-xs font-semibold">
                    Live telemetry console:
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">Node-BD-02 :5060</span>
                </div>
                {callProgress.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <ChevronRight size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Inbound Webhook Simulator */}
        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-outline-variant/30 dark:border-zinc-800/80 shadow-sm overflow-hidden flex flex-col">
          {/* Card Header */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 dark:border-zinc-800/60">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-gradient-info" />
                <h2 className="text-base sm:text-lg text-on-surface font-bold">
                  Inbound Webhook Simulator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                Simulate an order event from WooCommerce or Shopify with signed headers.
              </p>
            </div>
            <span className="badge-inverse-success shrink-0 self-start sm:self-auto text-xs font-bold">
              Signed HMAC SHA-256
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4">
            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-on-surface font-semibold">
                Payload Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetWooCommerce)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30 cursor-pointer active:scale-95 shadow-2xs"
                >
                  WooCommerce COD #999
                </button>
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetShopify)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30 cursor-pointer active:scale-95 shadow-2xs"
                >
                  Shopify Order #1045
                </button>
              </div>
            </div>

            {/* JSON Textarea with Secondary Yellow Copy Button */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  JSON Webhook Payload
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(webhookPayload);
                    showToast("Webhook payload copied to clipboard", "success");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-gray-950 font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
                  title="Copy JSON Payload"
                >
                  <Copy size={13} />
                  <span>Copy Payload</span>
                </button>
              </div>
              <textarea
                rows={7}
                value={webhookPayload}
                onChange={(e) => setWebhookPayload(e.target.value)}
                className="w-full bg-[#09090b] text-purple-200 font-mono text-xs p-3.5 rounded-xl border border-zinc-800 focus:outline-none focus:ring-2 focus:ring-[#9a55ff]/20 shadow-inner leading-relaxed"
              />
            </div>

            {/* Send Webhook Button */}
            <button
              onClick={handleSendWebhook}
              disabled={webhookLoading}
              className="w-full py-3 px-4 rounded-full btn-gradient-info text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              type="button"
            >
              <Send size={15} />
              <span>{webhookLoading ? "Ingesting Webhook..." : "Send Test Webhook"}</span>
            </button>

            {/* Response Console */}
            {webhookResponse && (
              <div className="p-3.5 rounded-xl bg-[#09090b] text-emerald-300 font-mono text-xs space-y-1.5 border border-zinc-800 shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-gray-400">
                  <span className="text-xs font-semibold">
                    Response (HTTP 200 OK):
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold font-mono">Latency: 38ms</span>
                </div>
                <pre className="overflow-x-auto text-xs leading-relaxed pt-1">
                  {webhookResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Originate Test Call Confirmation Modal */}
      <ConfirmModal
        isOpen={callConfirmOpen}
        onClose={() => setCallConfirmOpen(false)}
        onConfirm={() => {
          setCallConfirmOpen(false);
          handleDialTest();
        }}
        title="Make Test Call"
        description={`This will originate a live outbound phone call to ${testPhone} using your active phone line and play "${testFlow}". Real telecom units will be utilized.`}
        confirmText="Start Call"
        variant="warning"
        icon="phone_in_talk"
      />

      {/* Clear Logs Confirmation Modal */}
      <ConfirmModal
        isOpen={clearConfirmOpen}
        onClose={() => setClearConfirmOpen(false)}
        onConfirm={() => {
          setClearConfirmOpen(false);
          clearLogs();
        }}
        title="Clear Console Logs"
        description="Are you sure you want to clear the active telemetry logs and webhook response buffer?"
        confirmText="Clear Logs"
        variant="danger"
        icon="delete"
      />
    </div>
  );
}
