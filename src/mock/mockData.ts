export interface BusinessStore {
  id: string;
  uuid: string;
  name: string;
  email: string;
  domain: string;
  platform: string;
  defaultCountryCode: string;
  timezone: string;
  triggerMode: "instant" | "manual";
  cachedBalance: number;
  activeFlowId: string;
  boundFlowName: string;
}

export interface CallAttempt {
  attemptNumber: number;
  startedAt: string;
  outcome: "CONFIRMED" | "CANCELLED" | "NO_ANSWER" | "BUSY" | "FAILED";
  durationSec: number;
  costAmount: number;
}

export interface CallRecord {
  id: string;
  businessId: string;
  orderId: string;
  customerName: string;
  rawPhone: string;
  normalizedPhone: string;
  flowId: string;
  flowName: string;
  callState: string;
  outcome: "CONFIRMED" | "CANCELLED" | "NO_ANSWER" | "BUSY" | "TRANSFERRED" | "RETRY_QUEUED";
  dtmfKey: string | null;
  durationSec: number;
  billsec: number;
  costAmount: number;
  recordingUrl: string | null;
  startedAt: string;
  canRetry: boolean;
  orderAmount: string;
  city: string;
  attempts: CallAttempt[];
}

export interface AudioAsset {
  id: string;
  name: string;
  category: "ivr_prompt" | "hold_music" | "voicemail";
  durationSec: number;
  fileSizeBytes: number;
  fileSizeFormatted: string;
  referencedByFlows: string[];
  url: string;
  codec: string;
}

export const mockAccountBalance = 500.0;

export const mockBusinesses: BusinessStore[] = [
  {
    id: "biz-1",
    uuid: "b1-songsharer-9a8b417e",
    name: "SongsharerBazar",
    email: "admin@songsharerbazar.com.bd",
    domain: "songsharerbazar.com.bd",
    platform: "WooCommerce",
    defaultCountryCode: "+880",
    timezone: "Asia/Dhaka",
    triggerMode: "instant",
    cachedBalance: 500.0,
    activeFlowId: "flow-1",
    boundFlowName: "Order Confirmation Flow (v1.4)",
  },
  {
    id: "biz-2",
    uuid: "b2-uttaramart-883712fc",
    name: "Uttara Super Shop",
    email: "billing@uttaramart.com.bd",
    domain: "uttaramart.com.bd",
    platform: "Shopify",
    defaultCountryCode: "+880",
    timezone: "Asia/Dhaka",
    triggerMode: "manual",
    cachedBalance: 500.0,
    activeFlowId: "flow-2",
    boundFlowName: "Grocery Express Flow (v2.1)",
  },
];

export const mockAudioAssets: AudioAsset[] = [
  {
    id: "audio-1",
    name: "order_greeting_bn.wav",
    category: "ivr_prompt",
    durationSec: 8,
    fileSizeBytes: 128000,
    fileSizeFormatted: "128 KB",
    referencedByFlows: ["Order Confirmation Flow"],
    url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    codec: "PCM 16-bit 8000Hz • Mono",
  },
  {
    id: "audio-2",
    name: "order_confirm_thankyou.wav",
    category: "ivr_prompt",
    durationSec: 5,
    fileSizeBytes: 80000,
    fileSizeFormatted: "80 KB",
    referencedByFlows: ["Order Confirmation Flow"],
    url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    codec: "PCM 16-bit 8000Hz • Mono",
  },
  {
    id: "audio-3",
    name: "agent_transfer_hold_tune.wav",
    category: "hold_music",
    durationSec: 32,
    fileSizeBytes: 512000,
    fileSizeFormatted: "512 KB",
    referencedByFlows: ["Order Confirmation Flow", "VIP Verification Flow"],
    url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    codec: "PCM 16-bit 8000Hz • Mono",
  },
  {
    id: "audio-4",
    name: "night_hours_voicemail.wav",
    category: "voicemail",
    durationSec: 14,
    fileSizeBytes: 224000,
    fileSizeFormatted: "224 KB",
    referencedByFlows: ["Order Confirmation Flow"],
    url: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    codec: "PCM 16-bit 8000Hz • Mono",
  },
];

export const mockCalls: CallRecord[] = [
  // --- SongsharerBazar (biz-1) Calls ---
  {
    id: "call-1",
    businessId: "biz-1",
    orderId: "1045",
    customerName: "Tanvir Ahmed",
    rawPhone: "01712998877",
    normalizedPhone: "+8801712998877",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "completed",
    outcome: "CONFIRMED",
    dtmfKey: "1",
    durationSec: 34,
    billsec: 34,
    costAmount: 1.20,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 13:29:12",
    canRetry: false,
    orderAmount: "৳ 2,850 • Cash on Delivery",
    city: "Mirpur, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 13:29:12", outcome: "CONFIRMED", durationSec: 34, costAmount: 1.20 },
    ],
  },
  {
    id: "call-2",
    businessId: "biz-1",
    orderId: "1046",
    customerName: "Sewly Ahmed",
    rawPhone: "01948215645",
    normalizedPhone: "+8801948215645",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "no_answer",
    outcome: "NO_ANSWER",
    dtmfKey: null,
    durationSec: 0,
    billsec: 0,
    costAmount: 0.00,
    recordingUrl: null,
    startedAt: "2026-11-01 13:17:40",
    canRetry: true,
    orderAmount: "৳ 1,450 • Cash on Delivery",
    city: "Uttara, Dhaka",
    attempts: [
      { attemptNumber: 2, startedAt: "2026-11-01 13:17:40", outcome: "NO_ANSWER", durationSec: 0, costAmount: 0.00 },
      { attemptNumber: 1, startedAt: "2026-11-01 13:07:15", outcome: "BUSY", durationSec: 0, costAmount: 0.00 },
    ],
  },
  {
    id: "call-3",
    businessId: "biz-1",
    orderId: "1047",
    customerName: "Masud Rana",
    rawPhone: "01766674386",
    normalizedPhone: "+8801766674386",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "completed",
    outcome: "CANCELLED",
    dtmfKey: "2",
    durationSec: 28,
    billsec: 28,
    costAmount: 1.00,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 12:33:04",
    canRetry: false,
    orderAmount: "৳ 4,120 • Cash on Delivery",
    city: "Dhanmondi, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 12:33:04", outcome: "CANCELLED", durationSec: 28, costAmount: 1.00 },
    ],
  },
  {
    id: "call-4",
    businessId: "biz-1",
    orderId: "1048",
    customerName: "Ferdoshi Ahmed",
    rawPhone: "01707387365",
    normalizedPhone: "+8801707387365",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "busy",
    outcome: "BUSY",
    dtmfKey: null,
    durationSec: 0,
    billsec: 0,
    costAmount: 0.00,
    recordingUrl: null,
    startedAt: "2026-11-01 12:17:22",
    canRetry: true,
    orderAmount: "৳ 980 • Cash on Delivery",
    city: "Chittagong GPO",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 12:17:22", outcome: "BUSY", durationSec: 0, costAmount: 0.00 },
    ],
  },
  {
    id: "call-5",
    businessId: "biz-1",
    orderId: "1049",
    customerName: "Arif Hossain",
    rawPhone: "01822334455",
    normalizedPhone: "+8801822334455",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "completed",
    outcome: "TRANSFERRED",
    dtmfKey: "3",
    durationSec: 92,
    billsec: 92,
    costAmount: 3.20,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 11:45:10",
    canRetry: false,
    orderAmount: "৳ 7,500 • COD Verified",
    city: "Sylhet Sadar",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 11:45:10", outcome: "CONFIRMED", durationSec: 92, costAmount: 3.20 },
    ],
  },
  {
    id: "call-6",
    businessId: "biz-1",
    orderId: "1050",
    customerName: "Nasreen Sultana",
    rawPhone: "01677889900",
    normalizedPhone: "+8801677889900",
    flowId: "flow-1",
    flowName: "Order Confirmation Flow",
    callState: "queued",
    outcome: "RETRY_QUEUED",
    dtmfKey: null,
    durationSec: 0,
    billsec: 0,
    costAmount: 0.00,
    recordingUrl: null,
    startedAt: "2026-11-01 11:30:00",
    canRetry: true,
    orderAmount: "৳ 1,890 • Cash on Delivery",
    city: "Khulna City",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 11:30:00", outcome: "NO_ANSWER", durationSec: 0, costAmount: 0.00 },
    ],
  },

  // --- Uttara Super Shop (biz-2) Calls ---
  {
    id: "call-201",
    businessId: "biz-2",
    orderId: "2001",
    customerName: "Kamal Hossain",
    rawPhone: "01723456789",
    normalizedPhone: "+8801723456789",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "completed",
    outcome: "CONFIRMED",
    dtmfKey: "1",
    durationSec: 42,
    billsec: 42,
    costAmount: 1.50,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 14:10:05",
    canRetry: false,
    orderAmount: "৳ 3,450 • Grocery Essentials",
    city: "Uttara Sector 4, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 14:10:05", outcome: "CONFIRMED", durationSec: 42, costAmount: 1.50 },
    ],
  },
  {
    id: "call-202",
    businessId: "biz-2",
    orderId: "2002",
    customerName: "Farhana Yasmin",
    rawPhone: "01834567890",
    normalizedPhone: "+8801834567890",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "completed",
    outcome: "CONFIRMED",
    dtmfKey: "1",
    durationSec: 38,
    billsec: 38,
    costAmount: 1.35,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 13:50:18",
    canRetry: false,
    orderAmount: "৳ 1,980 • Baby Care Kit",
    city: "Gulshan 2, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 13:50:18", outcome: "CONFIRMED", durationSec: 38, costAmount: 1.35 },
    ],
  },
  {
    id: "call-203",
    businessId: "biz-2",
    orderId: "2003",
    customerName: "Rashedul Islam",
    rawPhone: "01945678901",
    normalizedPhone: "+8801945678901",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "no_answer",
    outcome: "NO_ANSWER",
    dtmfKey: null,
    durationSec: 0,
    billsec: 0,
    costAmount: 0.00,
    recordingUrl: null,
    startedAt: "2026-11-01 13:22:45",
    canRetry: true,
    orderAmount: "৳ 2,650 • Organic Cold-pressed Oil",
    city: "Banani, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 13:22:45", outcome: "NO_ANSWER", durationSec: 0, costAmount: 0.00 },
    ],
  },
  {
    id: "call-204",
    businessId: "biz-2",
    orderId: "2004",
    customerName: "Nazia Parveen",
    rawPhone: "01656789012",
    normalizedPhone: "+8801656789012",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "completed",
    outcome: "CANCELLED",
    dtmfKey: "2",
    durationSec: 22,
    billsec: 22,
    costAmount: 0.80,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 12:45:11",
    canRetry: false,
    orderAmount: "৳ 890 • Snacks & Beverages",
    city: "Baridhara DOHS, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 12:45:11", outcome: "CANCELLED", durationSec: 22, costAmount: 0.80 },
    ],
  },
  {
    id: "call-205",
    businessId: "biz-2",
    orderId: "2005",
    customerName: "Sabbir Rahman",
    rawPhone: "01767890123",
    normalizedPhone: "+8801767890123",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "completed",
    outcome: "CONFIRMED",
    dtmfKey: "1",
    durationSec: 48,
    billsec: 48,
    costAmount: 1.70,
    recordingUrl: "https://actions.google.com/sounds/v1/emergency/beeper_emergency_call.ogg",
    startedAt: "2026-11-01 11:58:30",
    canRetry: false,
    orderAmount: "৳ 5,200 • Premium Basmati & Ghee",
    city: "Bashundhara R/A, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 11:58:30", outcome: "CONFIRMED", durationSec: 48, costAmount: 1.70 },
    ],
  },
  {
    id: "call-206",
    businessId: "biz-2",
    orderId: "2006",
    customerName: "Tasnim Zahan",
    rawPhone: "01978901234",
    normalizedPhone: "+8801978901234",
    flowId: "flow-2",
    flowName: "VIP Verification Flow",
    callState: "queued",
    outcome: "RETRY_QUEUED",
    dtmfKey: null,
    durationSec: 0,
    billsec: 0,
    costAmount: 0.00,
    recordingUrl: null,
    startedAt: "2026-11-01 11:15:00",
    canRetry: true,
    orderAmount: "৳ 3,100 • Imported Dairy Items",
    city: "Mohakhali DOHS, Dhaka",
    attempts: [
      { attemptNumber: 1, startedAt: "2026-11-01 11:15:00", outcome: "NO_ANSWER", durationSec: 0, costAmount: 0.00 },
    ],
  },
];

export const mockDashboardData = {
  metrics: {
    todayCalls: 38,
    confirmedOrders: 31,
    confirmationRate: 81.6,
    waitingQueueCount: 3,
    scheduledRetriesCount: 2,
    averageDurationSec: 28,
  },
  concurrency: {
    activeChannels: 3,
    maxChannels: 5,
    utilizationPercent: 60,
  },
};

export const mockDepartments = [
  {
    id: "dept-1",
    name: "Customer Support (General)",
    code: "SUPP-01",
    strategy: "round_robin",
    operatingStatus: "09:00 - 22:00 BST (Open)",
    activeAgentsCount: 3,
  },
  {
    id: "dept-2",
    name: "Order Escalations & VIP",
    code: "ESCAL-02",
    strategy: "least_busy",
    operatingStatus: "10:00 - 19:00 BST (Open)",
    activeAgentsCount: 2,
  },
];

export const mockAgents = [
  {
    id: "ag-1",
    name: "Tanvir Ahmed",
    email: "tanvir@dialyra.com",
    departmentName: "Customer Support",
    extension: "1001",
    callsHandled: 24,
    isAvailable: true,
  },
  {
    id: "ag-2",
    name: "Sewly Begum",
    email: "sewly@dialyra.com",
    departmentName: "Customer Support",
    extension: "1002",
    callsHandled: 19,
    isAvailable: true,
  },
  {
    id: "ag-3",
    name: "Kabir Hossain",
    email: "kabir@dialyra.com",
    departmentName: "Order Escalations",
    extension: "1003",
    callsHandled: 8,
    isAvailable: false,
  },
];

export const mockDncList = [
  { id: "dnc-1", normalizedPhone: "+8801700000001", reason: "Customer requested verbal opt-out", addedAt: "2026-10-28" },
  { id: "dnc-2", normalizedPhone: "+8801900000002", reason: "Repeated prank dial / blocked buyer", addedAt: "2026-10-30" },
];
