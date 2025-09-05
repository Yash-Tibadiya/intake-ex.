import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ProgressBar: React.FC<{
  currentStepIndex: number;
  totalSteps: number;
}> = ({ currentStepIndex, totalSteps }) => {
  const percent = ((currentStepIndex + 1) / totalSteps) * 100;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get previous progress from localStorage or use current as fallback
  const getInitialProgress = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("progress_bar_percent");
      if (stored && mounted) {
        const storedPercent = parseFloat(stored);
        // Only use stored value if it's less than current (going forward)
        if (storedPercent < percent) {
          return storedPercent;
        }
      }
    }
    return percent;
  };

  const [animatedPercent, setAnimatedPercent] = useState(getInitialProgress);

  useEffect(() => {
    if (mounted) {
      // Store current progress
      localStorage.setItem("progress_bar_percent", percent.toString());

      // Animate to new progress
      const timer = setTimeout(() => {
        setAnimatedPercent(percent);
      }, 100); // Small delay to ensure smooth animation

      return () => clearTimeout(timer);
    }
  }, [percent, mounted]);

  if (!mounted) {
    return (
      <div className="relative w-full h-2 bg-[#a8beb7] rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-[#49615e] rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-2 bg-[#a8beb7] rounded-full overflow-hidden">
      <motion.div
        className="absolute inset-y-0 left-0 bg-[#49615e] rounded-full"
        initial={{ width: `${getInitialProgress()}%` }}
        animate={{ width: `${animatedPercent}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </div>
  );
};

export default ProgressBar;
