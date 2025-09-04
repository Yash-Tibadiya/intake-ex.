"use client";

import InfoBox from "@/components/InfoBox";
import InputRenderer from "@/components/InputRenderer";
import StripePayment from "@/components/StripePayment";
import { useState, useEffect, useRef } from "react";

interface Option {
  label: string;
  value: string;
}

interface Question {
  id: string | number;
  code: string;
  hint?: string;
  text: string;
  type: string;
  order: number;
  colspan: number;
  pattern?: string;
  required?: boolean;
  placeholder?: string;
  patternError?: string;
  requiredError?: string;
  options?: string[] | Option[];
  showFollowupWhen?: string;
  followup_questions?: Question[];
  min?: string | number;
  max?: string | number;
  maxError?: string;
  minError?: string;
  filetype?: string[];
  maxFileSize?: number;
  maxFilesAllowed?: number;
  component?: string;
  componentProps?: Record<string, any>;
}

interface Page {
  id: number;
  code: string;
  desc: string;
  order: number;
  title: string;
  columns: number;
  questions: Question[];
}

interface Config {
  pages: Page[];
}

const STORAGE_KEY = "intake_form_data";

export default function IntakeForm() {
  const [config, setConfig] = useState<Config | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const formDataRef = useRef<Record<string, any>>({});

  useEffect(() => {
    // Load config
    fetch("/config/form-config.json")
      .then((res) => res.json())
      .then((data) => {
        setConfig(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });

    // Load saved data
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);
      formDataRef.current = parsed;
    }
  }, []);

  useEffect(() => {
    // Save to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formDataRef.current));
  }, [formData]);

  if (loading || !config) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-black text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  const pages = config.pages.sort((a, b) => a.order - b.order);
  const currentPage = pages[currentPageIndex];
  const progress = ((currentPageIndex + 1) / pages.length) * 100;

  const handleInputChange = (code: string, value: any) => {
    formDataRef.current = { ...formDataRef.current, [code]: value };
    setFormData((prev) => ({ ...prev, [code]: value }));
    if (errors[code]) {
      setErrors((prev) => ({ ...prev, [code]: "" }));
    }
  };

  const validatePage = () => {
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
    if (validatePage()) {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const renderQuestion = (q: Question) => {
    const value = formDataRef.current[q.code] || "";
    const error = errors[q.code];
    const showFollowup =
      q.showFollowupWhen &&
      ((Array.isArray(value) && value.includes(q.showFollowupWhen)) ||
        value === q.showFollowupWhen);

    return (
      <div
        key={q.id}
        className={`${
          q.colspan === 2 ? "col-span-1 md:col-span-2" : "col-span-1"
        } space-y-2`}
      >
        <label className="block text-sm font-semibold text-gray-900">
          {q.text}
          {q.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {q.hint && (
          <p className="text-sm text-gray-700 bg-blue-50 border-l-4 border-blue-400 pl-4 py-2 rounded-r">
            {q.hint}
          </p>
        )}
        <InputRenderer question={q} value={value} onChange={handleInputChange} handleNext={handleNext} />
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


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-black">Intake Form</h2>
            <span className="text-sm font-medium text-gray-800 bg-white px-3 py-1 rounded-full shadow-sm">
              Step {currentPageIndex + 1} of {pages.length}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-black">
                  {currentPage.title}
                </h1>
                <p className="text-lg text-gray-800 mt-1">{currentPage.desc}</p>
              </div>
            </div>
          </div>

          {/* InfoBox Component */}
          {currentPageIndex === 15 && (
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
          )}

          {/* StripePayment Component - Only on Payment Page */}
          {currentPageIndex === 36 && (
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
              currentPage.columns === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {currentPage.questions
              .sort((a, b) => a.order - b.order)
              .map((q) => renderQuestion(q))}
          </form>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentPageIndex === 0}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${
              currentPageIndex === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200 hover:border-gray-300"
            }`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 flex items-center"
          >
            {currentPageIndex === pages.length - 1 ? (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Submit
              </>
            ) : (
              <>
                Next
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
