import { motion } from "framer-motion";
import Image from "next/image";

const NoJudgment = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <motion.div
      className="mb-4 sm:mb-8 w-full flex flex-col items-center relative min-h-screen px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: 0.2,
          type: "spring",
          stiffness: 100,
        }}
      >
        <Image
          src="/images/ww.jpg"
          alt="Hero"
          width={1000}
          height={1000}
          className="w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[550px] h-auto mt-4 sm:mt-8"
        />
      </motion.div>

      {/* Sticky CTA Button at bottom - Blurred background */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 w-full px-3 sm:px-4 md:px-6 py-12 sm:py-16 bg-white shadow-lg z-40 blur-lg"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1 }}
      ></motion.div>

      {/* Button without blur - positioned above the blurred background */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 w-full px-3 sm:px-4 md:px-6 py-8 sm:py-12 z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.1 }}
      >
        <motion.button
          onClick={handleNext}
          className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#193231] hover:bg-[#193231f2] text-white rounded-full font-semibold shadow-xl hover:shadow-[#19323157] flex items-center w-full justify-center cursor-pointer max-w-xs sm:max-w-sm md:max-w-md mx-auto text-sm sm:text-base transition-all duration-200"
          whileHover={{
            scale: 1.02,
            y: -2,
            boxShadow: "0 25px 50px -12px rgba(25, 50, 49, 0.25)",
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
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.3 }}
          >
            Next
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Add padding bottom to prevent content from being hidden behind the sticky button */}
      <div className="pb-16 sm:pb-20 md:pb-24"></div>
    </motion.div>
  );
};

export default NoJudgment;
