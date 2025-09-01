// components/FormNavigation.js
import React from "react";

const FormNavigation = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  loading = false,
  customButtons = null,
  page = null,
}) => {
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  if (customButtons) {
    return (
      <div className="flex justify-between mt-8 pt-6 border-t">
        {customButtons}
      </div>
    );
  }

  return (
    <div className="flex justify-between mt-8 pt-6 border-t">
      <button
        onClick={onPrevious}
        disabled={isFirstPage || loading}
        className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {page?.previousButtonText || "Previous"}
      </button>

      <button
        onClick={onNext}
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
      >
        {loading
          ? "Processing..."
          : page?.ctaText || (isLastPage ? "Submit" : "Next")}
      </button>
    </div>
  );
};

export default FormNavigation;
