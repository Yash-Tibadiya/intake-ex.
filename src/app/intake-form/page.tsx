// pages/intake-form.js
import { useState, useEffect } from "react";
import DynamicIntakeForm from "../components/DynamicIntakeForm";

export default function IntakeFormPage() {
  const [formConfig, setFormConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load form configuration
    // In a real app, this could come from an API
    fetch("/api/form-config")
      .then((res) => res.json())
      .then((config) => {
        setFormConfig(config);
        setLoading(false);
      })
      .catch(() => {
        // Fallback to local config
        setFormConfig(defaultFormConfig);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DynamicIntakeForm formConfig={formConfig} />
    </div>
  );
}

// Default form configuration (fallback)
const defaultFormConfig = {
  title: "Dynamic Intake Form",
  description: "Complete assessment form",
  pages: [
    {
      id: "demo_page",
      header: "Demo Form",
      subheader: "This is a demonstration of the dynamic form system",
      questions: [
        {
          id: "demo_text",
          type: "text",
          label: "Sample Text Input",
          placeholder: "Enter some text...",
          required: true,
        },
      ],
    },
  ],
};

// pages/api/form-config.js (API route to serve form configuration)
/*
export default function handler(req, res) {
  // In production, this could come from a database or CMS
  const formConfig = {
    // Your form configuration JSON here
  };
  
  res.status(200).json(formConfig);
}
*/

// utils/formValidation.js
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};

export const validateRequired = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return value && value.toString().trim() !== "";
};

// utils/formHelpers.js
export const formatPhone = (value) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length >= 10) {
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(
      6,
      10
    )}`;
  }
  return value;
};

export const getFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// hooks/useFormConfig.js
import { useState, useEffect } from "react";

export const useFormConfig = (configPath) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch(configPath);
        if (!response.ok) throw new Error("Failed to load config");
        const data = await response.json();
        setConfig(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, [configPath]);

  return { config, loading, error };
};
