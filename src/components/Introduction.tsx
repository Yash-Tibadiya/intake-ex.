import React from "react";
import { motion } from "framer-motion";

export default function Introduction({
  handleNext,
}: {
  handleNext: () => void;
}) {
  return (
    <motion.div
      className="bg-white flex flex-col justify-start gap-6 px-4 sm:px-6 lg:px-8 py-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Main Content */}
      <motion.div
        className="flex flex-col justify-center w-full mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-center space-y-3">
          {/* Main Heading */}
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#193231] leading-tight text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Explore weight loss plans.
          </motion.h1>

          {/* Subheading */}
          <motion.h2
            className="text-xl sm:text-2xl font-normal text-gray-800 leading-relaxed max-w-3xl mx-auto text-left"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Learn about treatment options based on your goals, habits, and
            health history.
          </motion.h2>
        </div>
      </motion.div>

      {/* Privacy Notice and Button Section */}
      <motion.div
        className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {/* Privacy Notice */}
        <div className="text-center">
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed text-left">
            By clicking &apos;Continue&apos;, you agree that Hims may use your
            responses to personalize your experience and other purposes as
            described in our{" "}
            <motion.span
              className="underline cursor-pointer hover:text-gray-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Privacy Policy
            </motion.span>
            . Responses prior to account creation will not be used as part of
            your medical assessment.
          </p>
        </div>

        {/* Continue Button */}
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
}
