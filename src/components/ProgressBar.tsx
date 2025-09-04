import { useState, useEffect } from 'react';

interface ProgressBarProps {
  currentIndex: number;
  totalPages: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentIndex, totalPages }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const targetProgress = ((currentIndex + 1) / totalPages) * 100;

  useEffect(() => {
    if (targetProgress !== animatedProgress) {
      const increment = targetProgress > animatedProgress ? 1 : -1;
      const interval = setInterval(() => {
        setAnimatedProgress((prev) => {
          const next = prev + increment;
          if ((increment > 0 && next >= targetProgress) || (increment < 0 && next <= targetProgress)) {
            clearInterval(interval);
            return targetProgress;
          }
          return next;
        });
      }, 20); // Adjust speed here (lower = faster)

      return () => clearInterval(interval);
    }
  }, [targetProgress, animatedProgress]);

  return (
    <div className="mb-3 flex justify-center">
      <div className="w-full bg-[#a8beb7] rounded-full h-2 shadow-inner">
        <div
          className="bg-[#49615e] h-2 rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;