"use client";
import React from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

// Utility function to merge classnames
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(" ");
};

// LettersPullUp component
const LettersPullUp = ({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) => {
  const splittedText = text.split("");

  const pullupVariant = {
    initial: { y: 10, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.015,
      },
    }),
  };
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div className="flex justify-start flex-wrap">
      {splittedText.map((current, i) => (
        <motion.div
          key={i}
          ref={ref}
          variants={pullupVariant}
          initial="initial"
          animate={isInView ? "animate" : ""}
          custom={i}
          className={cn(className)}
        >
          {current == " " ? <span>&nbsp;</span> : current}
        </motion.div>
      ))}
    </div>
  );
};

const TreatmentInfo = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <motion.div
      className="bg-white flex flex-col justify-start gap-6 px-4 sm:px-6 lg:px-8 py-8 w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex flex-col justify-center w-full mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="text-left space-y-6 max-w-3xl mx-auto">
          <motion.div
            className=""
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="/images/logo.webp"
              alt="Hero"
              width={1000}
              height={1000}
              className="w-full max-w-[80px] sm:max-w-[120px] h-auto my-4 sm:my-8"
            />
          </motion.div>

          <LettersPullUp
            text="You've got it. We'll begin with some questions about you."
            className="text-2xl sm:text-3xl font-medium text-[#193231] leading-relaxed"
          />

          <LettersPullUp
            text="After that, we'll dive into your health history to find which treatment option matches your goals and health history."
            className="text-2xl sm:text-3xl font-medium text-[#193231] leading-relaxed"
          />
        </div>
      </motion.div>

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

export default TreatmentInfo;
