// components/QuestionRenderer.js
import React from "react";
import {
  TextInput,
  NumberInput,
  EmailInput,
  TextareaInput,
  DateInput,
  RadioInput,
  CheckboxInput,
  SelectInput,
  SearchableDropdown,
  FileUpload,
  CustomReactComponent,
} from "./FormInputs";

const QuestionRenderer = ({ question, value, onChange, error }) => {
  const componentMap = {
    text: TextInput,
    number: NumberInput,
    email: EmailInput,
    textarea: TextareaInput,
    date: DateInput,
    radio: RadioInput,
    checkbox: CheckboxInput,
    select: SelectInput,
    searchable_dropdown: SearchableDropdown,
    file_upload: FileUpload,
    react_component: CustomReactComponent,
  };

  const Component = componentMap[question.type];

  if (!Component) {
    return (
      <div className="text-red-500">
        Unsupported question type: {question.type}
      </div>
    );
  }

  return (
    <div className="question-container">
      <Component
        question={question}
        value={value}
        onChange={onChange}
        error={error}
      />
    </div>
  );
};

export default QuestionRenderer;
