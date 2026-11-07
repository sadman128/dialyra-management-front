"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      q: "How does Dialyra connect to my WooCommerce or Shopify store?",
      a: "Integration takes less than 2 minutes. Install our native WooCommerce plugin or configure a standard signed webhook in Shopify pointing to your Dialyra endpoint. The moment a customer selects 'Cash on Delivery' at checkout, Dialyra triggers the automated verification call.",
    },
    {
      q: "Do my customers need to install any mobile app to receive calls?",
      a: "No! Dialyra initiates genuine outbound GSM voice calls over national telecommunications trunks directly to the customer's phone number. The call rings like a normal phone call on any mobile phone or landline.",
    },
    {
      q: "What happens if a customer doesn't answer or their phone is busy?",
      a: "Dialyra's Intelligent Retry Governor steps in automatically. Instead of failing immediately, the system tags the order as 'RETRY_QUEUED' and schedules up to 3 staggered call attempts (e.g., at 15 minutes, 45 minutes, and 2 hours), maximizing your order recovery rate.",
    },
    {
      q: "Can I record custom brand voice prompts in Bengali?",
      a: "Yes! You can upload high-fidelity studio-recorded `.wav` files in conversational Bengali or English directly through the Audio Library console. Dialyra splices dynamic order variables (Customer Name, Order Total, Items) into the audio stream in real time.",
    },
    {
      q: "How does the shared balance pool work across multiple businesses?",
      a: "Rather than managing separate pre-paid balances for each storefront, Dialyra unifies your funds into a single Distributed Multi-Business Pool. All your stores draw from this balance, and you can configure low-balance notification thresholds to prevent calling interruptions.",
    },
    {
      q: "Can customers speak with a real human agent if they have questions?",
      a: "Absolutely. With Live Human Escalation, customers can press DTMF Key 3 on their dialpad to be transferred instantly to your customer support department. Dialyra routes the live call to your agents via SIP softphones (such as MicroSIP, Linphone, or Zoiper) in under 250ms.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white border-t border-slate-200/80 scroll-mt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-4">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="text-base text-slate-600 font-medium">
            Everything you need to know about setting up Dialyra for your e-commerce operations.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/90 overflow-hidden bg-slate-50/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-[#9a55ff] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a55ff]"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <div
                    className={`p-1 rounded-lg bg-white border border-slate-200 text-slate-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#9a55ff] border-[#9a55ff]/40" : ""
                    }`}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
