// components/FormProgress.js
import React from "react";

const FormProgress = ({
  currentPage,
  totalPages,
  showPageTitles = false,
  pages = [],
}) => {
  const progress = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="mb-8">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Progress</span>
        <span className="text-sm text-gray-500">
          {currentPage + 1} of {totalPages}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Page Titles (Optional) */}
      {showPageTitles && (
        <div className="flex justify-between text-xs text-gray-400">
          {pages.map((page, index) => (
            <span
              key={page.id}
              className={`${
                index <= currentPage ? "text-blue-600 font-medium" : ""
              }`}
            >
              {page.shortTitle || page.header}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormProgress;