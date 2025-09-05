import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, BadgeDollarSign, EyeOff } from "lucide-react";

const WhyMinimal = ({ handleNext }: { handleNext: () => void }) => {
  const features = [
    {
      icon: EyeOff,
      title: "No hidden fees or membership cost",
    },
    {
      icon: BadgeDollarSign,
      title: "Same price at every dose",
    },
    {
      icon: Stethoscope,
      title: "Adjust medication anytime with a provider",
    },
  ];

  return (
    <motion.div
      className="bg-white px-4 sm:px-6 lg:px-8 py-8 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2
        className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Why Minimal?
      </motion.h2>

      <div className="space-y-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
          >
            <div className="flex-shrink-0 mt-1">
              <feature.icon className="w-6 h-6 text-gray-700" strokeWidth={2} />
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              {feature.title}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-lg font-medium text-gray-800 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        No insurance required – HSA & FSA eligible on all 3+ month plans.
      </motion.p>

      <motion.div
        className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8 mt-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.button
          onClick={handleNext}
          className="w-full bg-[#193231] hover:bg-[#193231f2] text-white font-semibold py-4 sm:py-5 rounded-full text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#193231]/20"
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: "0 20px 40px -12px rgba(25, 50, 49, 0.3)",
          }}
          whileTap={{
            scale: 0.98,
            y: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.3 }}
          >
            Continue
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default WhyMinimal;
