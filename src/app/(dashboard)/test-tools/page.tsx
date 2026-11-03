"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function TestToolsPage() {
  const { accountBalance, showToast } = useBusiness();
  const [testPhone, setTestPhone] = useState("+880 1720 128825");
  const [testFlow, setTestFlow] = useState("Order Confirmation Flow (v1.4)");
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
    setCallProgress(["Dialing +8801720128825 via Asterisk AMI Trunk #20..."]);

    setTimeout(() => {
      setCallProgress((p) => [...p, "Phone ringing (SIP 180 Ringing)..."]);
    }, 700);

    setTimeout(() => {
      setCallProgress((p) => [
        ...p,
        "Call answered (SIP 200 OK). Google Cloud TTS Greeting playing in bn-BD...",
      ]);
    }, 1500);

    setTimeout(() => {
      setCallProgress((p) => [...p, "DTMF Keypad Detected: Key '1' pressed by customer."]);
    }, 2400);

    setTimeout(() => {
      setCallProgress((p) => [
        ...p,
        "Order #999 confirmed in Dialyra middleware. Call completed in 32s. Trunk released.",
      ]);
      setCalling(false);
      showToast("Manual test call completed successfully!", "success");
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl text-on-surface tracking-tight font-bold">
              Test Tools
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sandbox Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5 font-medium">
            Simulate outbound phone calls, verify key responses, and test store webhooks.
          </p>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setClearConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-xs sm:text-sm font-bold shadow-xs transition-colors border border-outline-variant/30 active:scale-95 cursor-pointer"
            title="Clear logs"
            type="button"
          >
            <Icon name="cleaning_services" size={16} className="text-on-surface-variant" />
            <span>Clear Logs</span>
          </button>
        </div>
      </div>

      {/* 2. Compact Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Voice Trunk
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                BD-02
              </span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                Online
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono">
              Latency: 18ms · Jitter: 1.2ms
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary-container">
            <Icon name="dns" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Account Balance
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">
                ৳ {accountBalance.toFixed(2)}
              </span>
              <span className="text-xs text-on-surface-variant font-medium">BDT</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium">
              Shared across all businesses
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed/50 flex items-center justify-center text-on-secondary-fixed-variant">
            <Icon name="account_balance_wallet" size={22} />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-outline-variant/30 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">
              Webhook Engine
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-on-surface">Ready</span>
              <span className="text-xs text-on-tertiary-container font-semibold">
                0 Pending
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-mono">
              Status: Idle · Listening
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container">
            <Icon name="webhook" size={22} />
          </div>
        </div>
      </div>

      {/* 3. Main Section: Two Cards Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* CARD 1: Manual Outbound Test Call Generator */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-stitch-card flex flex-col overflow-hidden border border-outline-variant/30">
          {/* Card Header */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest border-b border-surface-container">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <Icon name="phone_in_talk" size={20} className="text-primary-container" />
                <h2 className="text-base sm:text-lg text-on-surface font-bold">
                  Make a Test Call
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                Dial your phone to test voice audio, menu prompts, and key responses.
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container/10 text-primary-container text-xs font-bold self-start sm:self-auto">
              <Icon name="call_made" size={14} />
              <span>Outbound Dispatcher</span>
            </span>
          </div>

          {/* Form Body */}
          <div className="p-5 flex flex-col gap-4 bg-surface-container-lowest">
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
                  <Icon name="call" size={16} />
                  <span className="text-xs font-semibold px-1 py-0.5 rounded bg-surface-container text-on-surface">
                    +880
                  </span>
                </span>
                <input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full pl-24 pr-3 py-2 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30 font-mono font-bold"
                  type="text"
                />
              </div>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <Icon name="info" size={13} className="text-primary-container shrink-0" />
                <span>Reachable Bangladesh mobile number for live test.</span>
              </p>
            </div>

            {/* Field 2 & 3: Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  Select Call Flow
                </label>
                <select
                  value={testFlow}
                  onChange={(e) => setTestFlow(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30 font-semibold"
                >
                  <option>Order Confirmation Flow (v1.4)</option>
                  <option>VIP Verification Flow (v2.1)</option>
                  <option>Grocery Express Flow (v2.1)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs sm:text-sm text-on-surface font-semibold">
                  Voice Trunk
                </label>
                <select className="w-full py-2 px-3 rounded-xl bg-surface-container-low text-on-surface text-xs sm:text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-container/20 transition-all border border-outline-variant/30 font-semibold">
                  <option>Trunk #20 (Asterisk Primary)</option>
                  <option>Trunk #21 (Backup Trunk)</option>
                </select>
              </div>
            </div>

            {/* Dial Button */}
            <button
              onClick={() => setCallConfirmOpen(true)}
              disabled={calling}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-container hover:bg-primary text-on-primary font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 mt-1 active:scale-95 cursor-pointer"
              type="button"
            >
              <Icon
                name="phone_in_talk"
                size={18}
                className={calling ? "animate-bounce" : ""}
              />
              <span>{calling ? "Calling..." : "Make Test Call"}</span>
            </button>

            {/* Live Console Output */}
            {callProgress.length > 0 && (
              <div className="p-3.5 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-xs space-y-1.5 border border-outline shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-secondary-fixed">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Live Telemetry Console:
                  </span>
                  <span className="text-[11px] text-surface-variant font-mono">Node-BD-02 :5060</span>
                </div>
                {callProgress.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <span className="text-tertiary-fixed-dim font-bold">➔</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CARD 2: Inbound Webhook Simulator */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-stitch-card flex flex-col overflow-hidden border border-outline-variant/30">
          {/* Card Header */}
          <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-lowest border-b border-surface-container">
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <Icon name="webhook" size={20} className="text-primary-container" />
                <h2 className="text-base sm:text-lg text-on-surface font-bold">
                  Inbound Webhook Simulator
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-on-surface-variant font-medium">
                Simulate an order event from WooCommerce or Shopify with signed headers.
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/15 text-on-tertiary-container text-xs font-semibold self-start sm:self-auto">
              <Icon name="verified" size={14} />
              <span>Signed HMAC</span>
            </span>
          </div>

          <div className="p-5 flex flex-col gap-4 bg-surface-container-lowest">
            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-on-surface font-semibold">
                Payload Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetWooCommerce)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30"
                >
                  WooCommerce COD #999
                </button>
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetShopify)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30"
                >
                  Shopify Order #1045
                </button>
              </div>
            </div>

            {/* JSON Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs sm:text-sm text-on-surface font-semibold">
                JSON Webhook Payload
              </label>
              <textarea
                rows={7}
                value={webhookPayload}
                onChange={(e) => setWebhookPayload(e.target.value)}
                className="w-full bg-surface-container-low text-on-surface font-mono text-xs p-3 rounded-xl border border-outline-variant/30 focus:outline-none focus:border-primary-container shadow-xs"
              />
            </div>

            {/* Send Webhook Button */}
            <button
              onClick={handleSendWebhook}
              disabled={webhookLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-primary-container text-on-primary font-bold text-xs sm:text-sm shadow-sm hover:shadow hover:bg-primary transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              type="button"
            >
              <Icon name="send" size={18} />
              <span>{webhookLoading ? "Ingesting..." : "Send Test Webhook"}</span>
            </button>

            {/* Response Console */}
            {webhookResponse && (
              <div className="p-3.5 rounded-xl bg-inverse-surface text-tertiary-fixed font-mono text-xs space-y-1.5 border border-outline shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-on-surface-variant">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Response (HTTP 200 OK):
                  </span>
                  <span className="text-[11px] text-tertiary-fixed-dim font-bold">Latency: 38ms</span>
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
