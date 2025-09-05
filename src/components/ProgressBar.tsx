const ProgressBar: React.FC<{
  currentStepIndex: number;
  totalSteps: number;
}> = ({ currentStepIndex, totalSteps }) => {
  // Progress is 0-based, so add 1 for display
  const percent = ((currentStepIndex + 1) / totalSteps) * 100;
  return (
    <div className="relative w-full h-2 bg-[#a8beb7] rounded-full overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-[#49615e] rounded-full transition-[width] duration-500"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;