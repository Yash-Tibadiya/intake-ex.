// components/FormPreview.js
import React from "react";

const FormPreview = ({ formData, formConfig, onEdit }) => {
  const renderPreviewValue = (question, value) => {
    if (!value) return <span className="text-gray-400">Not answered</span>;

    switch (question.type) {
      case "checkbox":
        if (Array.isArray(value)) {
          const labels = value.map((v) => {
            const option = question.options.find((opt) => opt.value === v);
            return option ? option.label : v;
          });
          return labels.join(", ");
        }
        return value;

      case "radio":
      case "select":
      case "searchable_dropdown":
        const option = question.options.find((opt) => opt.value === value);
        return option ? option.label : value;

      case "file_upload":
        if (Array.isArray(value)) {
          return `${value.length} file(s) uploaded`;
        }
        return "File uploaded";

      case "date":
        return new Date(value).toLocaleDateString();

      default:
        return value.toString();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold mb-6">Form Preview</h2>

      {formConfig.pages.map((page, pageIndex) => (
        <div key={page.id} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {page.header}
          </h3>

          <div className="space-y-4">
            {page.questions.map((question) => (
              <div key={question.id} className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">
                      {question.label}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {renderPreviewValue(question, formData[question.id])}
                    </p>
                  </div>

                  <button
                    onClick={() => onEdit(pageIndex)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 pt-6 border-t">
        <button className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
          Submit Form
        </button>
      </div>
    </div>
  );
};

export default FormPreview;