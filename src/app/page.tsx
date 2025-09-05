"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleStartIntake = () => {
    router.push('/intake-form/step_1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header with Logo */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Image
              src="/images/logo.webp"
              alt="Logo"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Our Intake Form
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Complete our comprehensive intake form to get started with our
            services. We&apos;ll guide you through each step to ensure we have
            all the information we need.
          </p>

          {/* CTA Button */}
          <button
            onClick={handleStartIntake}
            className="inline-flex items-center px-8 py-4 bg-[#193231] hover:bg-[#193231f2] text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl"
          >
            Start Intake Form
          </button>
        </div>
      </div>
    </div>
  );
}
