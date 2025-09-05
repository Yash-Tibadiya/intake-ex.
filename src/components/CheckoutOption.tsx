"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OptionKey = "3month" | "6month" | "12month";

export type CheckoutSelection = {
  key: OptionKey;
  label: string;
  monthlyPrice: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
  description: string;
  duration: string;
  popular?: boolean;
  bestValue?: boolean;
};

const STORAGE_KEY = "intake_form_data";

const OPTIONS: Record<OptionKey, CheckoutSelection> = {
  "12month": {
    key: "12month",
    label: "12 Monthly",
    monthlyPrice: 37,
    totalPrice: 444,
    originalPrice: 588,
    savings: 144,
    duration: "12 months",
    bestValue: true,
    description: "Best value for long-term weight management success.",
  },
  "6month": {
    key: "6month",
    label: "6 Monthly",
    monthlyPrice: 43,
    totalPrice: 258,
    originalPrice: 294,
    savings: 36,
    duration: "6 months",
    popular: true,
    description: "Popular choice for sustainable weight loss results.",
  },
  "3month": {
    key: "3month",
    label: "3 Monthly",
    monthlyPrice: 49,
    totalPrice: 147,
    originalPrice: 147,
    savings: 0,
    duration: "3 months",
    description: "Get started with our shortest commitment period.",
  },
};

export default function CheckoutOption() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKey = (searchParams.get("plan") as OptionKey) || "6month";
  const [selected, setSelected] = useState<OptionKey>(initialKey);

  // Ensure selected is a valid key
  useEffect(() => {
    if (!OPTIONS[selected]) {
      setSelected("6month");
    }
  }, [selected]);

  const current = useMemo(() => OPTIONS[selected], [selected]);

  const persistSelection = (sel: CheckoutSelection) => {
    try {
      const savedRaw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      const updated = {
        ...saved,
        checkout_option_key: sel.key,
        checkout_option_label: sel.label,
        checkout_option_monthly_price: sel.monthlyPrice,
        checkout_option_total_price: sel.totalPrice,
        checkout_option_duration: sel.duration,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // no-op
    }
  };

  const handleNext = () => {
    const sel = OPTIONS[selected];
    persistSelection(sel);

    // Only pass plan key; do not expose or trust price from URL
    const params = new URLSearchParams({
      plan: sel.key,
    });

    router.push(`/intake-form/payment-processing?${params.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Your Semaglutide Plan
        </h2>
        <p className="text-gray-600">
          Choose your weight loss journey duration
        </p>
      </div>

      {/* Pricing Cards - Simple Layout */}
      <div className="space-y-4">
        {Object.values(OPTIONS).map((opt) => {
          const active = opt.key === selected;
          return (
            <div
              key={opt.key}
              className={[
                "relative border rounded-xl p-6 cursor-pointer transition-all duration-200",
                active
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300",
              ].join(" ")}
              onClick={() => setSelected(opt.key)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {opt.label}
                    </h3>
                    {opt.bestValue && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Best Value
                      </span>
                    )}
                    {opt.popular && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className="text-3xl font-bold text-gray-900">
                      ${opt.monthlyPrice}
                    </span>
                    <span className="text-gray-500 ml-1">per month</span>
                  </div>
                </div>

                <div className="text-right">
                  {opt.savings > 0 && (
                    <div className="text-green-600 font-medium text-lg mb-1">
                      Save ${opt.savings}
                    </div>
                  )}
                  <div className="text-gray-500 text-sm">
                    Total: ${opt.totalPrice}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Plan Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">{current.label}</h3>
            <p className="text-gray-600 text-sm">{current.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              ${current.totalPrice}
            </div>
            <div className="text-gray-500 text-sm">
              ${current.monthlyPrice}/month for {current.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={handleNext}
          className="w-full bg-[#193231] hover:bg-[#193231f2] text-white py-4 px-6 rounded-xl font-semibold transition-colors"
        >
          Continue to Payment
        </button>
        <p className="mt-3 text-sm text-gray-500">
          Secure payment • Cancel anytime • HIPAA compliant
        </p>
      </div>
    </div>
  );
}