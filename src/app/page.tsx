"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IntakeForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step
    router.replace('/intake-form/step_1');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-black text-xl font-semibold">Redirecting to intake form...</div>
    </div>
  );
}
