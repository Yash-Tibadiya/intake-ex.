"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import InputRenderer from "@/components/InputRenderer";
import ProgressBar from "@/components/ProgressBar";
import StripePayment from "@/components/StripePayment";
import { Question, Page, Config } from "@/types/question";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "intake_form_data";

export default function IntakeFormPage() {
  const params = useParams();
  const router = useRouter();
  const pageCode = params.code as string;

  const [config, setConfig] = useState<Config | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [allPages, setAllPages] = useState<Page[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formDataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Load config
    fetch("/config/form-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        const pages = data.pages.sort((a: Page, b: Page) => a.order - b.order);
        setAllPages(pages);

        // Find the page with the matching code
        const page = pages.find((p: Page) => p.code === pageCode);
        if (page) {
          setCurrentPage(page);
        } else {
          console.log("Page not found");
        }
      });

    // Load saved data
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      formDataRef.current = parsed;
    }
  }, [pageCode]);

  useEffect(() => {
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formDataRef.current));
  }, [formData]);

  const handleInputChange = (code: string, value: any) => {
    formDataRef.current = { ...formDataRef.current, [code]: value };
    setFormData((prev) => ({ ...prev, [code]: value }));
    if (errors[code]) {
      setErrors((prev) => ({ ...prev, [code]: "" }));
    }
  };

  const validatePage = () => {
    if (!currentPage) return false;

    const newErrors: Record<string, string> = {};
    currentPage.questions.forEach((q) => {
      const value = formDataRef.current[q.code];
      if (
        q.required &&
        (!value || (Array.isArray(value) && value.length === 0))
      ) {
        newErrors[q.code] = q.requiredError || "This field is required";
      }
      if (q.pattern && value && !new RegExp(q.pattern).test(value)) {
        newErrors[q.code] = q.patternError || "Invalid format";
      }
      if (q.type === "number" && value) {
        const num = Number(value);
        const minVal = typeof q.min === "string" ? Number(q.min) : q.min;
        const maxVal = typeof q.max === "string" ? Number(q.max) : q.max;
        if (minVal !== undefined && num < minVal) {
          newErrors[q.code] = q.minError || `Minimum value is ${minVal}`;
        }
        if (maxVal !== undefined && num > maxVal) {
          newErrors[q.code] = q.maxError || `Maximum value is ${maxVal}`;
        }
      }
      if (q.type === "date" && value) {
        const date = new Date(value);
        if (q.min && date < new Date(q.min)) {
          newErrors[q.code] = q.minError || `Date must be after ${q.min}`;
        }
        if (q.max && date > new Date(q.max)) {
          newErrors[q.code] = q.maxError || `Date must be before ${q.max}`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage() && currentPage && allPages.length > 0) {
      const currentIndex = allPages.findIndex(
        (p) => p.code === currentPage.code
      );
      if (currentIndex < allPages.length - 1) {
        const nextPage = allPages[currentIndex + 1];
        router.push(`/intake-form/${nextPage.code}`);
      }
    }
  };

  const renderQuestion = (q: Question) => {
    const value = formDataRef.current[q.code] || "";
    const error = errors[q.code];
    const showFollowup =
      q.showFollowupWhen &&
      ((Array.isArray(value) && value.includes(q.showFollowupWhen)) ||
        value === q.showFollowupWhen);

    // Map numeric colspan to Tailwind col-span classes for a 12-column grid
    // Defaults: 1 => col-span-12 on 1-col pages, col-span-6 on 2-col pages
    const getColSpanClass = (colspan?: number) => {
      const cols = currentPage?.columns ?? 1;
      const span = Math.max(
        1,
        Math.min(12, (colspan ?? (cols === 1 ? 12 : 6)) * (cols === 1 ? 12 : 6))
      );
      // For simplicity, derive standard spans:
      if (cols === 1) {
        // Single column page uses a 1-col stack; make everything span full width
        return "col-span-12";
      }
      // Two-column layout: map 1->6, 2->12; clamp into allowed values
      const cs = colspan ?? 1;
      if (cs <= 1) return "col-span-6";
      return "col-span-12";
    };

    return (
      <div key={q.id} className={`${getColSpanClass(q.colspan)} space-y-2`}>
        <label className="block text-sm font-semibold text-gray-900 mt-2">
          {q.text}
        </label>
        {q.hint && (
          <p className="text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 pl-4 py-2 rounded-r">
            {q.hint}
          </p>
        )}
        <InputRenderer
          question={q}
          value={value}
          onChange={handleInputChange}
          handleNext={handleNext}
        />
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
        {showFollowup && q.followup_questions?.map((fq) => renderQuestion(fq))}
      </div>
    );
  };

  if (!currentPage) return <div className="min-h-screen bg-white"></div>;

  const currentIndex = allPages.findIndex((p) => p.code === currentPage.code);

  // Check if Next button should be hidden
  const hasVisibleFollowupQuestions = currentPage.questions?.some((q) => {
    const value = formDataRef.current[q.code] || "";
    const showFollowup =
      q.showFollowupWhen &&
      ((Array.isArray(value) && value.includes(q.showFollowupWhen)) ||
        value === q.showFollowupWhen);
    return (
      showFollowup && q.followup_questions && q.followup_questions.length > 0
    );
  });

  const shouldHideNextButton =
    !currentPage.questions ||
    currentPage.questions.length === 0 ||
    (currentPage.questions.some((q) => q.type === "radio") &&
      !hasVisibleFollowupQuestions);

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={500}
            height={500}
            className="max-w-24 h-auto object-contain"
          />
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentStepIndex={currentIndex}
          totalSteps={allPages.length}
        />

        {/* Page Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage.code} // This ensures animation triggers on page change
            className="my-8"
            initial={{ opacity: 0, x: 100 }} // Start from right (100px offset)
            animate={{ opacity: 1, x: 0 }} // Animate to center
            exit={{ opacity: 0, x: -100 }} // Exit to left
            transition={{
              duration: 0.6,
              ease: "easeOut",
              opacity: { duration: 0.5 }, // Faster opacity change
            }}
          >
            <div className="mb-3">
              <div className="flex items-center">
                <div>
                  <h1 className="text-4xl font-medium text-black">
                    {currentPage.title}
                  </h1>
                  <p className="text-lg text-gray-800 mt-1">
                    {currentPage.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* InfoBox Component */}
            {/* {currentIndex === 14 && (
              <div className="mb-8">
                <InfoBox
                  title="Important Information"
                  points={[
                    "Your email will be used for account verification",
                    "We will send important updates to this address",
                    "Make sure to use a valid email address",
                  ]}
                />
              </div>
            )} */}

            {/* StripePayment Component - Only on Payment Page */}
            {currentPage.code === "payment_processing" && (
              <div className="mb-8">
                <StripePayment
                  amount={99.99}
                  currency="usd"
                  onPaymentSuccess={(paymentIntent) => {
                    console.log("Payment successful:", paymentIntent);
                  }}
                  onPaymentError={(error) => {
                    console.log("Payment failed:", error);
                  }}
                />
              </div>
            )}

            <form
              className={`grid gap-6 ${
                currentPage.columns === 1 ? "grid-cols-12" : "grid-cols-12"
              }`}
            >
              {currentPage.questions
                .sort((a, b) => a.order - b.order)
                .map((q) => renderQuestion(q))}
            </form>

            {/* Navigation */}
            {!shouldHideNextButton && (
              <div className="flex justify-between items-center mt-8">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-[#193231] hover:bg-[#193231f2] text-white rounded-full font-semibold shadow-xl hover:shadow-[#19323157] flex items-center w-full justify-center cursor-pointer"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
