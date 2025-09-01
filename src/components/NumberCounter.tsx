import React, { useState } from 'react';

interface NumberCounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const NumberCounter: React.FC<NumberCounterProps> = ({
  initialValue = 0,
  min = 0,
  max = 100,
  step = 1,
  label = "Quantity"
}) => {
  const [value, setValue] = useState(initialValue);

  const increment = () => {
    setValue(prev => Math.min(prev + step, max));
  };

  const decrement = () => {
    setValue(prev => Math.max(prev - step, min));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= min && newValue <= max) {
      setValue(newValue);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">{label}</h3>

      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={decrement}
          disabled={value <= min}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-200 ${
            value <= min
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-md hover:shadow-lg'
          }`}
        >
          −
        </button>

        <div className="flex flex-col items-center">
          <input
            type="number"
            value={value}
            onChange={handleInputChange}
            min={min}
            max={max}
            step={step}
            className="w-20 h-12 text-center text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
          />
          <span className="text-sm text-gray-500 mt-1">Current Value</span>
        </div>

        <button
          onClick={increment}
          disabled={value >= max}
          className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-200 ${
            value >= max
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-md hover:shadow-lg'
          }`}
        >
          +
        </button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Range: {min} - {max} | Step: {step}
        </p>
      </div>
    </div>
  );
};

export default NumberCounter;