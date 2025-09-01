import React from 'react';

interface InfoBoxProps {
  title: string;
  points: string[];
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, points }) => (
  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-sm">
    <h3 className="text-lg font-semibold text-black mb-4 flex items-center">
      <svg
        className="w-5 h-5 text-blue-600 mr-2"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clipRule="evenodd"
        />
      </svg>
      {title}
    </h3>
    <ul className="space-y-2">
      {points.map((point, index) => (
        <li key={index} className="flex items-start text-gray-900">
          <svg
            className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          {point}
        </li>
      ))}
    </ul>
  </div>
);

export default InfoBox;