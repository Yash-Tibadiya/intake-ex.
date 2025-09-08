import React from "react";
import { InputRendererProps } from "@/types/question";

const InputRenderer: React.FC<InputRendererProps> = ({
  question: q,
  value,
  onChange,
  handleNext,
}) => {
  const baseInputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#253c3c] focus:border-[#253c3c] transition-all duration-200 bg-white shadow-sm hover:shadow-md text-gray-900 placeholder-gray-500";

  switch (q.type) {
    case "text":
    case "email":
    case "number":
      return (
        <input
          type={q.type}
          value={value}
          onChange={(e) => onChange(q.code, e.target.value)}
          placeholder={q.placeholder}
          min={q.min}
          max={q.max}
          className={baseInputClasses}
        />
      );
    case "textarea":
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(q.code, e.target.value)}
          placeholder={q.placeholder}
          rows={4}
          className={`${baseInputClasses} resize-none text-gray-900 placeholder-gray-500`}
        />
      );
    case "date":
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(q.code, e.target.value)}
          className={`${baseInputClasses} text-gray-900`}
        />
      );
    case "radio":
      return (
        <div className="space-y-3">
          {q.options?.map((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            const optSublabel =
              typeof opt === "string" ? undefined : opt.sublabel;
            const optImage = typeof opt === "string" ? undefined : opt.image;
            const isSelected = value === optValue;
            return (
              <label
                key={optValue}
                className={`flex items-center p-3 sm:p-6 rounded-lg border-2 border-[#193231cb] hover:bg-[#1932312a] cursor-pointer transition-all duration-200 ${
                  isSelected ? "bg-[#1932312a]" : ""
                }`}
              >
                <input
                  type="radio"
                  name={q.code}
                  value={optValue}
                  checked={isSelected}
                  onChange={(e) => {
                    onChange(q.code, e.target.value);
                    if (
                      !q.showFollowupWhen ||
                      e.target.value !== q.showFollowupWhen
                    ) {
                      handleNext?.();
                    }
                  }}
                  onClick={(e) => {
                    if (value === optValue) {
                      if (
                        !q.showFollowupWhen ||
                        optValue !== q.showFollowupWhen
                      ) {
                        handleNext?.();
                      }
                    }
                  }}
                  className="opacity-0 absolute w-4 h-4"
                />
                {optImage && (
                  <img
                    src={optImage}
                    alt={optLabel}
                    className="w-16 h-16 object-contain mr-3 select-none pointer-events-none"
                  />
                )}
                <span className="ml-3">
                  <span className="block text-gray-900 font-medium text-xl">
                    {optLabel}
                  </span>
                  {optSublabel && (
                    <span className="block text-sm text-gray-600">
                      {optSublabel}
                    </span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
      );
    case "checkbox":
      return (
        <div className="space-y-3">
          {q.options?.map((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            const isNoneOfTheAbove = optLabel
              .toLowerCase()
              .includes("none of the above");
            const isChecked = Array.isArray(value) && value.includes(optValue);
            return (
              <label
                key={optValue}
                className={`flex items-center p-3 sm:p-6 rounded-lg border-2 border-[#193231cb] hover:bg-[#1932312a] cursor-pointer transition-all duration-200 ${
                  isChecked ? "bg-[#1932312a]" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={optValue}
                  checked={Array.isArray(value) && value.includes(optValue)}
                  onChange={(e) => {
                    const current = Array.isArray(value) ? value : [];
                    let updated: string[];

                    if (e.target.checked) {
                      if (isNoneOfTheAbove) {
                        // If "None of the above" is selected, only keep it
                        updated = [optValue];
                      } else {
                        // If any other option is selected, remove "None of the above" if present
                        updated = current.filter((v) => {
                          const option = q.options?.find(
                            (o) => (typeof o === "string" ? o : o.value) === v
                          );
                          const optionLabel =
                            typeof option === "string"
                              ? option
                              : option?.label || "";
                          return !optionLabel
                            .toLowerCase()
                            .includes("none of the above");
                        });
                        updated.push(optValue);
                      }
                    } else {
                      // If unchecking, just remove the current option
                      updated = current.filter((v) => v !== optValue);
                    }

                    onChange(q.code, updated);
                  }}
                  className="w-4 h-4 accent-[#253c3c] border-gray-300 rounded focus:ring-[#253c3c]"
                />
                <span className="ml-3 text-gray-700 font-medium">
                  {optLabel}
                </span>
              </label>
            );
          })}
        </div>
      );
    case "searchableDropdown":
      return (
        <select
          value={value}
          onChange={(e) => onChange(q.code, e.target.value)}
          className={`${baseInputClasses} cursor-pointer text-gray-900`}
        >
          <option value="">{q.placeholder || "Select an option..."}</option>
          {q.options?.map((opt) => {
            const optValue = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={optValue} value={optValue}>
                {optLabel}
              </option>
            );
          })}
        </select>
      );
    case "document":
      return (
        <div className="space-y-2">
          <input
            type="file"
            multiple
            accept={q.filetype?.join(",")}
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              if (q.maxFilesAllowed && files.length > q.maxFilesAllowed) {
                alert(`Maximum ${q.maxFilesAllowed} files allowed`);
                return;
              }
              if (q.maxFileSize) {
                const oversized = files.filter(
                  (f) => f.size > q.maxFileSize! * 1024 * 1024
                );
                if (oversized.length > 0) {
                  alert(`File size must be less than ${q.maxFileSize}MB`);
                  return;
                }
              }
              onChange(q.code, files);
            }}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-900 bg-gray-50 hover:bg-gray-100 hover:border-[#253c3c] transition-all duration-200 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#253c3c]/10 file:text-[#253c3c] hover:file:bg-[#253c3c]/20"
          />
          {q.maxFileSize && (
            <p className="text-xs text-gray-700">
              Maximum file size: {q.maxFileSize}MB
            </p>
          )}
        </div>
      );
    default:
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-black">Unsupported question type: {q.type}</p>
        </div>
      );
  }
};

export default InputRenderer;
