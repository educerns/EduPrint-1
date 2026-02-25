import { useState } from "react";

interface Plan {
  id: string;
  name: string;
  tag?: string;
  tagStyle: string;
  credits?: number;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  cardClass: string;
  nameClass: string;
  priceClass: string;
  ctaClass: string;
  checkColor: string;
  featureTextClass: string;
  disabled: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Free Trial",
    tag: "Current Plan",
    tagStyle: "bg-gray-100 text-gray-500",
    price: "₹0",
    period: "forever",
    description: "Try our video editor with up to 2 video uploads — no payment required.",
    features: [
      "Upload & edit up to 2 videos",
      "Access all editing tools",
      "Basic templates included",
      "Watermark on export",
    ],
    cta: "Active",
    cardClass: "bg-gray-50 border border-gray-200",
    nameClass: "text-gray-500",
    priceClass: "text-gray-400",
    ctaClass: "bg-gray-100 text-gray-400 cursor-not-allowed",
    checkColor: "#9ca3af",
    featureTextClass: "text-gray-400",
    disabled: true,
  },
  {
    id: "premium",
    name: "Premium",
    tag: "Popular",
    tagStyle: "bg-blue-100 text-[#2c4e86]",
    credits: 100,
    price: "₹499",
    period: "per pack",
    description: "Buy 100 credits and upload videos as you need — pay only for what you use.",
    features: [
      "100 credits per purchase",
      "1 credit = 1 video upload",
      "No watermark on export",
      "Priority rendering",
      "All premium templates",
    ],
    cta: "Buy Premium",
    cardClass: "bg-white border border-gray-200 hover:border-[#2c4e86] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
    nameClass: "text-gray-900",
    priceClass: "text-gray-900",
    ctaClass: "bg-white text-[#2c4e86] border border-[#2c4e86] hover:bg-blue-50 transition-colors duration-150 cursor-pointer",
    checkColor: "#1a56db",
    featureTextClass: "text-gray-700",
    disabled: false,
  },
  {
    id: "standard",
    name: "Standard",
    tag: "Best Value",
    tagStyle: "bg-[#2c4e86] text-white",
    credits: 500,
    price: "₹1,999",
    period: "per pack",
    description: "Power users get 500 credits at a fraction of the cost — ideal for teams.",
    features: [
      "500 credits per purchase",
      "1 credit = 1 video upload",
      "No watermark on export",
      "Priority rendering",
      "All premium templates",
      "Dedicated support",
      "Bulk export options",
    ],
    cta: "Buy Standard",
    cardClass: "bg-blue-50 border border-[#2c4e86] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200",
    nameClass: "text-[#2c4e86]",
    priceClass: "text-[#2c4e86]",
    ctaClass: "bg-[#2c4e86] text-white hover:bg-blue-800 transition-colors duration-150 cursor-pointer",
    checkColor: "#1a56db",
    featureTextClass: "text-gray-700",
    disabled: false,
  },
];

interface PremiumMembershipModalProps {
  onClose?: () => void;
  onSelectPlan?: (planId: string) => void;
}

export default function PremiumMembershipModal({
  onClose,
  onSelectPlan,
}: PremiumMembershipModalProps) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 font-sans">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-7">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Upgrade Your Plan</h2>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                You've used your 2 free video uploads. Choose a plan to continue.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors duration-150 flex-shrink-0"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="h-px bg-gray-100 my-5" />

        {/* 3-column grid */}
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-xl p-5 flex flex-col ${plan.cardClass}`}
            >
              {/* Badge */}
              {plan.tag && (
                <span className={`absolute -top-3 right-3 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${plan.tagStyle}`}>
                  {plan.tag}
                </span>
              )}

              {/* Credits pill */}
              {plan.credits && (
                <div className="inline-flex items-center gap-1.5 bg-blue-100 rounded-md px-2 py-0.5 mb-2.5 self-start">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#1a56db" strokeWidth="2.5" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span className="text-xs font-bold text-[#2c4e86]">{plan.credits} Credits</span>
                </div>
              )}

              {/* Plan name */}
              <h3 className={`text-lg font-extrabold tracking-tight mb-1.5 ${plan.nameClass}`}>
                {plan.name}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">{plan.description}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 my-4">
                <span className={`text-3xl font-extrabold tracking-tight ${plan.priceClass}`}>
                  {plan.price}
                </span>
                <span className="text-sm text-gray-400 font-medium">{plan.period}</span>
              </div>

              <div className="h-px bg-gray-200 mb-3.5" />

              {/* Features */}
              <ul className="flex flex-col gap-2 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs leading-snug">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                      stroke={plan.checkColor}
                      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      className="flex-shrink-0 mt-0.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className={plan.featureTextClass}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                disabled={plan.disabled}
                onClick={() => !plan.disabled && onSelectPlan?.(plan.id)}
                className={`w-full flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold tracking-wide mt-auto ${plan.ctaClass}`}
              >
                {plan.cta}
                {!plan.disabled && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2.5" strokeLinecap="round" className="ml-1.5">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-5 tracking-wide">
          Credits never expire  · Cancel anytime
        </p>
      </div>
    </div>
  );
}