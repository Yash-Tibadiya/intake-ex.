"use client";

import { useMemo } from "react";
import StripePayment from "@/components/StripePayment";

type PlanKey = "3month" | "6month" | "12month";

export type PaymentProps = {
  // Optional explicit plan key; if omitted we will derive from localStorage
  planKey?: PlanKey;
  storageKey?: string; // defaults to intake_form_data
  currency?: string; // defaults to usd
};

const DEFAULT_STORAGE_KEY = "intake_form_data";

// Canonical plan table for safe client-side mapping
// Keep these values in sync with CheckoutOption OPTIONS table
const PLAN_TABLE: Record<
  PlanKey,
  { label: string; totalPrice: number; monthlyPrice: number; duration: string }
> = {
  "12month": {
    label: "12 Monthly",
    totalPrice: 444,
    monthlyPrice: 37,
    duration: "12 months",
  },
  "6month": {
    label: "6 Monthly",
    totalPrice: 258,
    monthlyPrice: 43,
    duration: "6 months",
  },
  "3month": {
    label: "3 Monthly",
    totalPrice: 147,
    monthlyPrice: 49,
    duration: "3 months",
  },
};

export default function Payment({
  planKey,
  storageKey = DEFAULT_STORAGE_KEY,
  currency = "usd",
}: PaymentProps) {
  const { amount, label, monthlyPrice, duration } = useMemo(() => {
    // Prefer persisted selection set by CheckoutOption
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const saved = JSON.parse(raw);
        // New persisted fields coming from CheckoutOption:
        // checkout_option_total_price, checkout_option_label, checkout_option_key, etc.
        if (
          typeof saved.checkout_option_total_price === "number" &&
          typeof saved.checkout_option_label === "string" &&
          typeof saved.checkout_option_monthly_price === "number" &&
          typeof saved.checkout_option_duration === "string"
        ) {
          return {
            amount: saved.checkout_option_total_price as number,
            label: saved.checkout_option_label as string,
            monthlyPrice: saved.checkout_option_monthly_price as number,
            duration: saved.checkout_option_duration as string,
          };
        }
        // If only key is stored, use mapping table
        if (typeof saved.checkout_option_key === "string") {
          const k = saved.checkout_option_key as PlanKey;
          if (PLAN_TABLE[k]) {
            return {
              amount: PLAN_TABLE[k].totalPrice,
              label: PLAN_TABLE[k].label,
              monthlyPrice: PLAN_TABLE[k].monthlyPrice,
              duration: PLAN_TABLE[k].duration,
            };
          }
        }
      }
    } catch {
      // ignore JSON/localStorage errors
    }

    // Fallback: explicit prop key
    if (planKey && PLAN_TABLE[planKey]) {
      return {
        amount: PLAN_TABLE[planKey].totalPrice,
        label: PLAN_TABLE[planKey].label,
        monthlyPrice: PLAN_TABLE[planKey].monthlyPrice,
        duration: PLAN_TABLE[planKey].duration,
      };
    }

    // Final fallback: default to 6-month plan
    return {
      amount: PLAN_TABLE["6month"].totalPrice,
      label: PLAN_TABLE["6month"].label,
      monthlyPrice: PLAN_TABLE["6month"].monthlyPrice,
      duration: PLAN_TABLE["6month"].duration,
    };
  }, [planKey, storageKey]);

  return (
    <div className="max-w-2xl mx-auto">
      <StripePayment
        amount={amount}
        currency={currency}
        label={label}
        monthlyPrice={monthlyPrice}
        duration={duration}
        onPaymentSuccess={(paymentIntent) => {
          console.log("Payment successful:", paymentIntent);
          // Here you could redirect to success page or update UI
        }}
        onPaymentError={(error) => {
          console.log("Payment failed:", error);
          // Here you could show error handling
        }}
      />
    </div>
  );
}
