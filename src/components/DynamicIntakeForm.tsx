// components/DynamicIntakeForm.js
import React, { useState, useEffect } from "react";
import { ChevronDown, Upload, X } from "lucide-react";

const DynamicIntakeForm = ({ formConfig }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const currentPage = formConfig.pages[currentPageIndex];
  const totalPages = formConfig.pages.length;
  const progress = ((currentPageIndex + 1) / totalPages) * 100;

  // Handle form field changes
  const handleFieldChange = (questionId, value, subQuestionId = null) => {
    setFormData((prev) => {
      const newData = { ...prev };

      if (subQuestionId) {
        if (!newData[questionId]) newData[questionId] = {};
        newData[questionId][subQuestionId] = value;
      } else {
        newData[questionId] = value;
      }

      return newData;
    });

    // Clear errors when user starts typing
    if (errors[questionId]) {
      setErrors((prev) => ({
        ...prev,
        [questionId]: null,
      }));
    }
  };

  // Validate current page
  const validateCurrentPage = () => {
    const newErrors = {};

    currentPage.questions.forEach((question) => {
      if (question.required && shouldShowQuestion(question)) {
        const value = formData[question.id];

        if (
          !value ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === "string" && value.trim() === "")
        ) {
          newErrors[question.id] = `${question.label} is required`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Check if question should be shown based on conditions
  const shouldShowQuestion = (question) => {
    if (!question.showIf) return true;

    const { questionId, operator, value } = question.showIf;
    const fieldValue = formData[questionId];

    switch (operator) {
      case "equals":
        return fieldValue === value;
      case "contains":
        return Array.isArray(fieldValue) && fieldValue.includes(value);
      case "not_empty":
        return fieldValue && fieldValue.length > 0;
      default:
        return true;
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (validateCurrentPage()) {
      if (currentPageIndex < totalPages - 1) {
        setCurrentPageIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  // Render different question types
  const renderQuestion = (question) => {
    if (!shouldShowQuestion(question)) return null;

    const value = formData[question.id] || "";
    const error = errors[question.id];

    return (
      <div key={question.id} className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {question.label}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {question.hint && (
          <p className="text-sm text-gray-500 mb-3">{question.hint}</p>
        )}

        {renderQuestionInput(question, value, error)}

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        {/* Render sub-questions */}
        {question.subQuestions && renderSubQuestions(question, value)}
      </div>
    );
  };

  const renderQuestionInput = (question, value, error) => {
    const baseInputClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      error ? "border-red-500" : "border-gray-300"
    }`;

    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFieldChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={baseInputClasses}
          />
        );

      case "email":
        return (
          <input
            type="email"
            value={value}
            onChange={(e) => handleFieldChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className={baseInputClasses}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFieldChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            min={question.min}
            max={question.max}
            className={baseInputClasses}
          />
        );

      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) => handleFieldChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={question.rows || 4}
            className={baseInputClasses}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFieldChange(question.id, e.target.value)}
            className={baseInputClasses}
          />
        );

      case "radio":
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name={question.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) =>
                    handleFieldChange(question.id, e.target.value)
                  }
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <div className="space-y-2">
            {question.options.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onChange={(e) => {
                    const newValue = Array.isArray(value) ? [...value] : [];
                    if (e.target.checked) {
                      newValue.push(option.value);
                    } else {
                      const index = newValue.indexOf(option.value);
                      if (index > -1) newValue.splice(index, 1);
                    }
                    handleFieldChange(question.id, newValue);
                  }}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );

      case "select":
        return (
          <div className="relative">
            <select
              value={value}
              onChange={(e) => handleFieldChange(question.id, e.target.value)}
              className={`${baseInputClasses} appearance-none pr-8`}
            >
              <option value="">
                {question.placeholder || "Select an option"}
              </option>
              {question.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
        );

      case "searchable_dropdown":
        return (
          <SearchableDropdown
            question={question}
            value={value}
            onChange={(val) => handleFieldChange(question.id, val)}
          />
        );

      case "file_upload":
        return (
          <FileUpload
            question={question}
            value={value}
            onChange={(val) => handleFieldChange(question.id, val)}
          />
        );

      case "react_component":
        return (
          <CustomReactComponent
            component={question.component}
            value={value}
            onChange={(val) => handleFieldChange(question.id, val)}
          />
        );

      default:
        return <div>Unsupported question type: {question.type}</div>;
    }
  };

  const renderSubQuestions = (parentQuestion, parentValue) => {
    if (!parentQuestion.subQuestions) return null;

    return (
      <div className="ml-6 mt-4 space-y-4 border-l-2 border-gray-200 pl-4">
        {parentQuestion.subQuestions.map((subQuestion) => {
          if (!shouldShowSubQuestion(subQuestion, parentValue)) return null;

          return (
            <div key={subQuestion.id}>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                {subQuestion.label}
                {subQuestion.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {subQuestion.hint && (
                <p className="text-sm text-gray-400 mb-2">{subQuestion.hint}</p>
              )}

              {renderSubQuestionInput(parentQuestion.id, subQuestion)}
            </div>
          );
        })}
      </div>
    );
  };

  const shouldShowSubQuestion = (subQuestion, parentValue) => {
    if (!subQuestion.showIf) return true;

    const { triggerValue } = subQuestion.showIf;
    if (Array.isArray(parentValue)) {
      return parentValue.includes(triggerValue);
    }
    return parentValue === triggerValue;
  };

  const renderSubQuestionInput = (parentId, subQuestion) => {
    const value = formData[parentId]?.[subQuestion.id] || "";

    switch (subQuestion.type) {
      case "text":
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              handleFieldChange(parentId, e.target.value, subQuestion.id)
            }
            placeholder={subQuestion.placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "textarea":
        return (
          <textarea
            value={value}
            onChange={(e) =>
              handleFieldChange(parentId, e.target.value, subQuestion.id)
            }
            placeholder={subQuestion.placeholder}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return renderQuestionInput(
          { ...subQuestion, id: `${parentId}.${subQuestion.id}` },
          value,
          null
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white min-h-screen">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {currentPageIndex + 1} of {totalPages}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Header and Subheader */}
      {currentPage.header && (
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {currentPage.header}
        </h1>
      )}

      {currentPage.subheader && (
        <p className="text-gray-600 mb-6">{currentPage.subheader}</p>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {currentPage.questions.map((question) => renderQuestion(question))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t">
        <button
          onClick={handlePrevious}
          disabled={currentPageIndex === 0}
          className="px-6 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {currentPage.ctaText ||
            (currentPageIndex === totalPages - 1 ? "Submit" : "Next")}
        </button>
      </div>
    </div>
  );
};

// Searchable Dropdown Component
const SearchableDropdown = ({ question, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOptions = question.options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = question.options.find((opt) => opt.value === value);

  return (
    <div className="relative">
      <div
        className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer bg-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
          {selectedOption
            ? selectedOption.label
            : question.placeholder || "Search and select..."}
        </span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchTerm("");
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// File Upload Component
const FileUpload = ({ question, value, onChange }) => {
  const [files, setFiles] = useState(value || []);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.filter((file) => {
      if (question.allowedFormats) {
        const fileExtension = file.name.split(".").pop().toLowerCase();
        return question.allowedFormats.includes(fileExtension);
      }
      return true;
    });

    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  const removeFile = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange(updatedFiles);
  };

  return (
    <div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">
          {question.uploadText || "Click to upload or drag and drop"}
        </p>
        {question.allowedFormats && (
          <p className="text-sm text-gray-400">
            Allowed formats: {question.allowedFormats.join(", ")}
          </p>
        )}
        <input
          type="file"
          multiple={question.multiple}
          accept={
            question.allowedFormats
              ? question.allowedFormats.map((f) => `.${f}`).join(",")
              : undefined
          }
          onChange={handleFileChange}
          className="hidden"
          id={`file-${question.id}`}
        />
        <label
          htmlFor={`file-${question.id}`}
          className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700"
        >
          Choose Files
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded"
            >
              <span className="text-sm text-gray-700">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Custom React Component Renderer
const CustomReactComponent = ({ component, value, onChange }) => {
  if (!component) return null;

  // This would be where you'd render custom components based on the component config
  // For now, returning a placeholder
  return (
    <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
      <p className="text-sm text-gray-600">
        Custom Component: {component.name}
      </p>
      <p className="text-xs text-gray-500">
        Component config: {JSON.stringify(component.props)}
      </p>
    </div>
  );
};

export default DynamicIntakeForm;

// Example usage in a page
// pages/intake-form.js
/*
import DynamicIntakeForm from '../components/DynamicIntakeForm';
import formConfig from '../config/form-config.json';

export default function IntakeFormPage() {
  return <DynamicIntakeForm formConfig={formConfig} />;
}
*/
