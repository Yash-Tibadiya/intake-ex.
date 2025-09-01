// components/FormInputs/TextInput.js
import React from "react";

const TextInput = ({ question, value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {question.label}
        {question.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {question.hint && (
        <p className="text-sm text-gray-500 mb-3">{question.hint}</p>
      )}

      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={question.placeholder}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        maxLength={question.maxLength}
        pattern={question.pattern}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {question.maxLength && (
        <p className="text-xs text-gray-400 mt-1">
          {(value || "").length}/{question.maxLength} characters
        </p>
      )}
    </div>
  );
};

export default TextInput;