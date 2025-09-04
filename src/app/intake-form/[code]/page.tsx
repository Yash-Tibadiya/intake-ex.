"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import InfoBox from "@/components/InfoBox";
import InputRenderer from "@/components/InputRenderer";
import StripePayment from "@/components/StripePayment";
import { Question, Page, Config } from "@/types/question";

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
  const [loading, setLoading] = useState(true);
  const [pageNotFound, setPageNotFound] = useState(false);
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
          setPageNotFound(false);
        } else {
          setPageNotFound(true);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setPageNotFound(true);
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

  const handlePrev = () => {
    if (currentPage && allPages.length > 0) {
      const currentIndex = allPages.findIndex(
        (p) => p.code === currentPage.code
      );
      if (currentIndex > 0) {
        const prevPage = allPages[currentIndex - 1];
        router.push(`/intake-form/${prevPage.code}`);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-8 px-4">
        <div className="max-w-xl mx-auto">
          {/* Logo Skeleton */}
          <div className="flex justify-center mb-3">
            <div className="w-24 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Progress Bar Skeleton */}
          <div className="mb-3 flex justify-center">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse w-full"></div>
            </div>
          </div>

          {/* Page Content Skeleton */}
          <div className="my-8">
            {/* Page Title Skeleton */}
            <div className="mb-8">
              <div className="mb-4">
                <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-1/2"></div>
              </div>
            </div>

            {/* Form Fields Skeleton */}
            <div className="space-y-6">
              {/* Field 1 */}
              <div
                className="space-y-2 animate-pulse"
                style={{ animationDelay: "0.1s" }}
              >
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>

              {/* Field 2 */}
              <div
                className="space-y-2 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>

              {/* Field 3 */}
              <div
                className="space-y-2 animate-pulse"
                style={{ animationDelay: "0.3s" }}
              >
                <div className="h-4 bg-gray-200 rounded w-2/5"></div>
                <div className="h-12 bg-gray-200 rounded-xl"></div>
              </div>
            </div>

            {/* Navigation Skeleton */}
            <div className="flex justify-between items-center mt-8">
              <div
                className="h-12 bg-gray-200 rounded-full animate-pulse w-full"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageNotFound || !currentPage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The requested page "{pageCode}" does not exist.
          </p>
          <button
            onClick={() => router.push("/intake-form/step_1")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
          >
            Go to First Step
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = allPages.findIndex((p) => p.code === currentPage.code);
  const progress = ((currentIndex + 1) / allPages.length) * 100;

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <Image
            src="/images/logo.webp"
            alt="Logo"
            width={500}
            height={500}
            className="max-w-24 h-auto object-contain"
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-3 flex justify-center">
          <div className="w-full bg-[#a8beb7] rounded-full h-2 shadow-inner">
            <div
              className="bg-[#49615e] h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Page Content */}
        <div className="my-8">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div>
                <h1 className="text-3xl font-medium text-black">
                  {currentPage.title}
                </h1>
                <p className="text-lg text-gray-800 mt-1">{currentPage.desc}</p>
              </div>
            </div>
          </div>

          {/* InfoBox Component */}
          {currentIndex === 14 && (
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
          {currentIndex === 35 && (
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

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-[#193231] hover:bg-[#193231f2] text-white rounded-full font-semibold shadow-xl hover:shadow-[#19323157] flex items-center w-full justify-center cursor-pointer"
            >
              {currentIndex === allPages.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
