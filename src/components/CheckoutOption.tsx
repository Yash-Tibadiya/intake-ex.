"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OptionKey = "basic" | "standard" | "premium";

export type CheckoutSelection = {
  key: OptionKey;
  label: string;
  price: number;
  description: string;
};

const STORAGE_KEY = "intake_form_data";

const OPTIONS: Record<OptionKey, CheckoutSelection> = {
  basic: {
    key: "basic",
    label: "Basic",
    price: 49.99,
    description: "Core features to get started quickly.",
  },
  standard: {
    key: "standard",
    label: "Standard",
    price: 99.99,
    description: "Popular choice with added support and features.",
  },
  premium: {
    key: "premium",
    label: "Premium",
    price: 149.99,
    description: "All features unlocked with priority support.",
  },
};

export default function CheckoutOption() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialKey = (searchParams.get("plan") as OptionKey) || "standard";
  const [selected, setSelected] = useState<OptionKey>(initialKey);

  // Ensure selected is a valid key
  useEffect(() => {
    if (!OPTIONS[selected]) {
      setSelected("standard");
    }
  }, [selected]);

  const current = useMemo(() => OPTIONS[selected], [selected]);

  const persistSelection = (sel: CheckoutSelection) => {
    try {
      const savedRaw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      const saved = savedRaw ? JSON.parse(savedRaw) : {};
      const updated = {
        ...saved,
        checkout_option_key: sel.key,
        checkout_option_label: sel.label,
        checkout_option_price: sel.price,
        checkout_option_desc: sel.description,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // no-op
    }
  };

  const handleNext = () => {
    const sel = OPTIONS[selected];
    persistSelection(sel);

    // Also pass along in query for redundancy/SSR-safe handoff
    const params = new URLSearchParams({
      plan: sel.key,
      price: String(sel.price),
    });

    router.push(`/intake-form/payment-processing?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {Object.values(OPTIONS).map((opt) => {
          const active = opt.key === selected;
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => setSelected(opt.key)}
              className={[
                "w-full text-left border rounded-xl px-4 py-4 transition",
                active
                  ? "border-emerald-700 ring-2 ring-emerald-200 bg-emerald-50"
                  : "border-gray-300 hover:border-gray-400",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{opt.label}</div>
                  <div className="text-sm text-gray-700 mt-1">{opt.description}</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-900">${opt.price.toFixed(2)}</div>
                  {active ? (
                    <div className="text-xs text-emerald-800 font-medium mt-1">Selected</div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1">Choose</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border rounded-xl p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600">Current selection</div>
            <div className="text-lg font-semibold text-gray-900">{current.label}</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">${current.price.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="px-6 py-3 bg-[#193231] hover:bg-[#193231f2] text-white rounded-full font-semibold shadow-xl hover:shadow-[#19323157] flex items-center w-full justify-center cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}