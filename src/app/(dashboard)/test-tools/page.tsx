"use client";

import React, { useState } from "react";
import { useBusiness } from "@/context/BusinessContext";
import { Icon } from "@/components/ui/Icon";

export default function TestToolsPage() {
  const { showToast } = useBusiness();
  const [testPhone, setTestPhone] = useState("+880 1720 128825");
  const [testFlow, setTestFlow] = useState("Order Confirmation Flow (v1.4)");
  const [callProgress, setCallProgress] = useState<string[]>([]);
  const [calling, setCalling] = useState(false);

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
    <div className="flex flex-col w-full space-y-8 pb-16">
      {/* 1. Page Header (Stitch UI 100% Exact) */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-on-surface-variant text-xs uppercase tracking-wider font-bold mb-1">
              <span>Diagnostics Suite</span>
              <Icon name="chevron_right" size={14} />
              <span className="text-primary-container dark:text-primary-fixed">Pre-Flight Sandbox</span>
            </div>
            <h1 className="text-2xl md:text-3xl text-on-surface tracking-tight font-bold">
              Test &amp; Diagnostic Tools
            </h1>
            <p className="text-base text-on-surface-variant font-medium">
              Simulate live phone calls, verify IVR DTMF responses, and test store webhook payload ingestion.
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container -ml-4" />
              <span className="text-sm text-on-surface font-bold ml-1">
                Sandbox Live
              </span>
              <span className="font-mono text-xs text-on-surface-variant px-2 py-0.5 rounded bg-surface-container ml-1 font-semibold">
                ENV: PROD-TEST
              </span>
            </div>
            <button
              onClick={clearLogs}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container text-on-surface text-sm font-bold shadow-sm transition-colors border border-outline-variant/30"
              title="Purge local telemetry buffer"
              type="button"
            >
              <Icon name="cleaning_services" size={18} className="text-on-surface-variant" />
              <span>Clear Logs</span>
            </button>
          </div>
        </div>

        {/* 2. Diagnostic Health Strip / Telemetry Pills (Stitch UI 100% Exact) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pill 1: SIP Node */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container shrink-0">
                <Icon name="dns" size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                  <span className="text-base text-on-surface font-bold truncate">
                    SIP Trunk Node: BD-02
                  </span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant mt-0.5">
                  Latency: 18ms • Jitter: 1.2ms
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container font-mono text-xs text-on-tertiary-container font-bold">
              99.98% OK
            </span>
          </div>

          {/* Pill 2: Telephony Balance */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                <Icon name="account_balance_wallet" size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                  Active Telephony Balance
                </span>
                <span className="text-2xl text-on-surface leading-tight font-bold mt-0.5">
                  ৳ 515.50 BDT
                </span>
              </div>
            </div>
            <span className="text-xs text-secondary bg-secondary-fixed/50 px-2.5 py-1 rounded-full font-bold">
              ~515 test calls
            </span>
          </div>

          {/* Pill 3: Webhook Engine */}
          <div className="flex items-center justify-between p-5 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-container/10 flex items-center justify-center text-primary-container shrink-0">
                <Icon name="webhook" size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-on-tertiary-container animate-pulse" />
                  <span className="text-base text-on-surface font-bold">
                    Webhook Engine
                  </span>
                </div>
                <span className="font-mono text-xs text-on-surface-variant mt-0.5">
                  Status: Ready • Queue: 0 pending
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-container font-mono text-xs text-primary font-bold">
              IDLE
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Section: Two Cards Side-by-Side (Stitch UI 100% Exact) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pb-8">
        {/* ==============================================================
            CARD 1: Manual Outbound Test Call Generator
            ============================================================== */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/30">
          {/* Card Header */}
          <div className="p-6 md:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border-b border-surface-container">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2.5">
                <Icon name="phone_in_talk" size={24} className="text-primary-container" />
                <h2 className="text-xl text-on-surface font-bold">
                  Make a Test Call
                </h2>
              </div>
              <p className="text-base text-on-surface-variant font-medium mt-0.5">
                Dial your own phone number to test audio clarity, TTS voices, and keypad responses.
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-container/10 text-primary-container text-xs font-bold self-start sm:self-auto">
              <Icon name="call_made" size={16} />
              <span>Outbound SIP Dispatcher</span>
            </span>
          </div>

          {/* Form Body */}
          <div className="p-6 md:p-7 flex flex-col gap-6 bg-surface-container-lowest">
            {/* Field 1: Destination Phone Number */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  Destination Phone Number (with Country Code)
                </label>
                <span className="font-code-sm text-code-sm text-on-surface-variant">E.164 Format</span>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-on-surface-variant flex items-center gap-1 select-none pointer-events-none">
                  <Icon name="call" size={18} />
                  <span className="text-xs font-semibold px-1 py-0.5 rounded bg-surface-container text-on-surface">
                    BD +880
                  </span>
                </span>
                <input
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full pl-28 pr-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-outline-variant/30 font-mono font-bold"
                  type="text"
                />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                <Icon name="info" size={14} className="text-on-tertiary-container shrink-0" />
                <span>Must be a reachable mobile or landline number in Bangladesh.</span>
              </p>
            </div>

            {/* Field 2 & 3: Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  Select Call Flow
                </label>
                <select
                  value={testFlow}
                  onChange={(e) => setTestFlow(e.target.value)}
                  className="w-full py-2.5 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-outline-variant/30 font-semibold"
                >
                  <option>Order Confirmation Flow (v1.4)</option>
                  <option>VIP Verification Flow (v2.1)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface font-semibold">
                  Telecom SIP Trunk
                </label>
                <select className="w-full py-2.5 px-3 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container transition-all border border-outline-variant/30 font-semibold">
                  <option>Trunk #20 (Asterisk AMI Primary)</option>
                  <option>Trunk #21 (Failover Secondary)</option>
                </select>
              </div>
            </div>

            {/* Dial Button */}
            <button
              onClick={handleDialTest}
              disabled={calling}
              className="w-full py-3 px-space-lg rounded-xl bg-secondary-container hover:bg-secondary-fixed-dim text-on-secondary-fixed font-bold font-label-lg text-label-lg transition-all shadow-md flex items-center justify-center gap-2 mt-2"
              type="button"
            >
              <Icon
                name="phone_in_talk"
                size={20}
                className={calling ? "animate-bounce" : ""}
              />
              <span>{calling ? "Calling Mobile Number..." : "Dial Test Call Now"}</span>
            </button>

            {/* Live Console Output */}
            {callProgress.length > 0 && (
              <div className="p-4 rounded-xl bg-inverse-surface text-inverse-on-surface font-mono text-sm space-y-2 border border-outline shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-secondary-fixed">
                  <span className="font-bold uppercase tracking-wider text-xs">
                    Live Telemetry Console:
                  </span>
                  <span className="text-xs text-surface-variant font-mono">Node-BD-02 :5060</span>
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

        {/* ==============================================================
            CARD 2: Inbound Webhook Simulator
            ============================================================== */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden border border-outline-variant/30">
          {/* Card Header */}
          <div className="p-space-lg flex flex-col sm:flex-row sm:items-center justify-between gap-space-md bg-surface-container-lowest border-b border-surface-container">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2">
                <Icon name="webhook" size={22} className="text-primary-container" />
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Inbound Webhook Simulator
                </h2>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Simulate an order creation event from WooCommerce or Shopify with signed HMAC headers.
              </p>
            </div>
            <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/15 text-on-tertiary-container font-label-sm text-label-sm font-semibold self-start sm:self-auto">
              <Icon name="verified" size={14} />
              <span>Signed HMAC SHA-256</span>
            </span>
          </div>

          <div className="p-space-lg flex flex-col gap-space-lg bg-surface-container-lowest">
            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                Payload Presets
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetWooCommerce)}
                  className="px-3 py-1.5 rounded-lg text-label-sm font-label-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30"
                >
                  WooCommerce COD #999
                </button>
                <button
                  type="button"
                  onClick={() => setWebhookPayload(presetShopify)}
                  className="px-3 py-1.5 rounded-lg text-label-sm font-label-sm font-semibold bg-surface-container-low text-on-surface hover:bg-surface-container transition border border-outline-variant/30"
                >
                  Shopify Order #1045
                </button>
              </div>
            </div>

            {/* JSON Textarea */}
            <div className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md text-on-surface font-semibold">
                JSON Inbound Webhook Payload
              </label>
              <textarea
                rows={7}
                value={webhookPayload}
                onChange={(e) => setWebhookPayload(e.target.value)}
                className="w-full bg-inverse-surface text-primary-fixed-dim font-mono text-xs p-3.5 rounded-xl border border-outline focus:outline-none shadow-inner"
              />
            </div>

            {/* Send Webhook Button */}
            <button
              onClick={handleSendWebhook}
              disabled={webhookLoading}
              className="w-full py-3 px-space-lg rounded-xl bg-primary-container text-on-primary font-bold font-label-lg text-label-lg shadow-md hover:bg-primary transition-all flex items-center justify-center gap-2"
              type="button"
            >
              <Icon name="send" size={20} />
              <span>{webhookLoading ? "Ingesting Webhook..." : "Send Simulated Webhook"}</span>
            </button>

            {/* Response Console */}
            {webhookResponse && (
              <div className="p-4 rounded-xl bg-inverse-surface text-tertiary-fixed font-mono text-sm space-y-1.5 border border-outline shadow-inner">
                <div className="flex items-center justify-between pb-1 border-b border-white/10 text-on-surface-variant">
                  <span className="font-bold uppercase tracking-wider text-xs">
                    Response (HTTP 200 OK):
                  </span>
                  <span className="text-xs text-tertiary-fixed-dim font-bold">Latency: 38ms</span>
                </div>
                <pre className="overflow-x-auto text-sm leading-relaxed pt-1">
                  {webhookResponse}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
