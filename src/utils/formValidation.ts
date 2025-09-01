// utils/formValidators.js
export const validators = {
  required: (value, message = "This field is required") => {
    if (Array.isArray(value)) {
      return value.length > 0 ? null : message;
    }
    return value && value.toString().trim() !== "" ? null : message;
  },

  email: (value, message = "Please enter a valid email address") => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  minLength: (minLength, message) => (value) => {
    return value && value.length >= minLength
      ? null
      : message || `Must be at least ${minLength} characters`;
  },

  maxLength: (maxLength, message) => (value) => {
    return !value || value.length <= maxLength
      ? null
      : message || `Must be no more than ${maxLength} characters`;
  },

  pattern: (pattern, message) => (value) => {
    const regex = new RegExp(pattern);
    return !value || regex.test(value) ? null : message || "Invalid format";
  },

  fileSize: (maxSizeMB, message) => (files) => {
    if (!files || files.length === 0) return null;

    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSizeBytes);

    return oversizedFiles.length === 0
      ? null
      : message || `File size must be less than ${maxSizeMB}MB`;
  },

  fileType: (allowedTypes, message) => (files) => {
    if (!files || files.length === 0) return null;

    const invalidFiles = files.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return !allowedTypes.includes(extension);
    });

    return invalidFiles.length === 0
      ? null
      : message || `Only ${allowedTypes.join(", ")} files are allowed`;
  },
};