// components/FormBuilder.js (Admin interface to create/edit forms)
import React, { useState } from "react";

const FormBuilder = () => {
  const [formConfig, setFormConfig] = useState({
    title: "",
    description: "",
    pages: [],
  });

  const addPage = () => {
    const newPage = {
      id: `page_${Date.now()}`,
      header: "",
      subheader: "",
      questions: [],
    };

    setFormConfig((prev) => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
  };

  const addQuestion = (pageIndex) => {
    const newQuestion = {
      id: `question_${Date.now()}`,
      type: "text",
      label: "",
      required: false,
      options: [],
    };

    setFormConfig((prev) => {
      const newConfig = { ...prev };
      newConfig.pages[pageIndex].questions.push(newQuestion);
      return newConfig;
    });
  };

  const questionTypes = [
    { value: "text", label: "Text Input" },
    { value: "email", label: "Email Input" },
    { value: "number", label: "Number Input" },
    { value: "textarea", label: "Textarea" },
    { value: "date", label: "Date Input" },
    { value: "radio", label: "Radio Buttons" },
    { value: "checkbox", label: "Checkboxes" },
    { value: "select", label: "Dropdown" },
    { value: "searchable_dropdown", label: "Searchable Dropdown" },
    { value: "file_upload", label: "File Upload" },
    { value: "react_component", label: "Custom Component" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Form Builder</h1>

      {/* Form Info */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Form Title"
            value={formConfig.title}
            onChange={(e) =>
              setFormConfig((prev) => ({ ...prev, title: e.target.value }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            placeholder="Form Description"
            value={formConfig.description}
            onChange={(e) =>
              setFormConfig((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Pages */}
      <div className="space-y-6">
        {formConfig.pages.map((page, pageIndex) => (
          <div key={page.id} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Page {pageIndex + 1}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Page Header"
                value={page.header}
                onChange={(e) => {
                  const newConfig = { ...formConfig };
                  newConfig.pages[pageIndex].header = e.target.value;
                  setFormConfig(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Page Subheader"
                value={page.subheader}
                onChange={(e) => {
                  const newConfig = { ...formConfig };
                  newConfig.pages[pageIndex].subheader = e.target.value;
                  setFormConfig(newConfig);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {page.questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="border border-gray-200 p-4 rounded"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={question.type}
                      onChange={(e) => {
                        const newConfig = { ...formConfig };
                        newConfig.pages[pageIndex].questions[
                          questionIndex
                        ].type = e.target.value;
                        setFormConfig(newConfig);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Question Label"
                      value={question.label}
                      onChange={(e) => {
                        const newConfig = { ...formConfig };
                        newConfig.pages[pageIndex].questions[
                          questionIndex
                        ].label = e.target.value;
                        setFormConfig(newConfig);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    />

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => {
                          const newConfig = { ...formConfig };
                          newConfig.pages[pageIndex].questions[
                            questionIndex
                          ].required = e.target.checked;
                          setFormConfig(newConfig);
                        }}
                        className="mr-2"
                      />
                      Required
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => addQuestion(pageIndex)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addPage}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
      >
        Add Page
      </button>

      {/* JSON Output */}
      <div className="mt-8 bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Generated JSON:</h3>
        <pre className="text-sm overflow-auto max-h-96">
          {JSON.stringify(formConfig, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default FormBuilder;
