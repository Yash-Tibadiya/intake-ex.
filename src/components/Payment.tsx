"use client";

import { useMemo } from "react";
import StripePayment from "@/components/StripePayment";

type PlanKey = "basic" | "standard" | "premium";

export type PaymentProps = {
  // Optional explicit plan key; if omitted we will derive from localStorage
  planKey?: PlanKey;
  storageKey?: string; // defaults to intake_form_data
  currency?: string; // defaults to usd
};

const DEFAULT_STORAGE_KEY = "intake_form_data";

// Canonical plan table for safe client-side mapping
const PLAN_TABLE: Record<PlanKey, { label: string; price: number }> = {
  basic: { label: "Basic", price: 49.99 },
  standard: { label: "Standard", price: 99.99 },
  premium: { label: "Premium", price: 149.99 },
};

export default function Payment({
  planKey,
  storageKey = DEFAULT_STORAGE_KEY,
  currency = "usd",
}: PaymentProps) {
  const { amount, label } = useMemo(() => {
    // Authoritative choice: use persisted selection if available
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const saved = JSON.parse(raw);
        if (typeof saved.checkout_option_price === "number" && typeof saved.checkout_option_label === "string") {
          return { amount: saved.checkout_option_price as number, label: saved.checkout_option_label as string };
        }
        // If only key is stored, use mapping
        if (typeof saved.checkout_option_key === "string") {
          const k = saved.checkout_option_key as PlanKey;
          if (PLAN_TABLE[k]) {
            return { amount: PLAN_TABLE[k].price, label: PLAN_TABLE[k].label };
          }
        }
      }
    } catch {
      // ignore JSON/localStorage errors
    }

    // Fallback: explicit prop key
    if (planKey && PLAN_TABLE[planKey]) {
      return { amount: PLAN_TABLE[planKey].price, label: PLAN_TABLE[planKey].label };
    }

    // Final fallback: default standard
    return { amount: PLAN_TABLE.standard.price, label: PLAN_TABLE.standard.label };
  }, [planKey, storageKey]);

  return (
    <div className="mb-8">
      <div className="mb-3 text-sm text-gray-700">
        Selected plan: <span className="font-semibold">{label}</span> — ${amount.toFixed(2)}
      </div>
      <StripePayment
        amount={amount}
        currency={currency}
        onPaymentSuccess={(paymentIntent) => {
          console.log("Payment successful:", paymentIntent);
        }}
        onPaymentError={(error) => {
          console.log("Payment failed:", error);
        }}
      />
    </div>
  );
}