// components/ConditionalRenderer.js
import React from "react";

const ConditionalRenderer = ({ condition, formData, children }) => {
  if (!condition) return children;

  const { questionId, operator, value } = condition;
  const fieldValue = formData[questionId];

  const shouldShow = () => {
    switch (operator) {
      case "equals":
        return fieldValue === value;
      case "not_equals":
        return fieldValue !== value;
      case "contains":
        return Array.isArray(fieldValue) && fieldValue.includes(value);
      case "not_contains":
        return Array.isArray(fieldValue) && !fieldValue.includes(value);
      case "greater_than":
        return Number(fieldValue) > Number(value);
      case "less_than":
        return Number(fieldValue) < Number(value);
      case "not_empty":
        return fieldValue && fieldValue.length > 0;
      case "empty":
        return !fieldValue || fieldValue.length === 0;
      case "in":
        return Array.isArray(value) && value.includes(fieldValue);
      case "not_in":
        return Array.isArray(value) && !value.includes(fieldValue);
      default:
        return true;
    }
  };

  return shouldShow() ? children : null;
};

export default ConditionalRenderer;
