// utils/formStorage.js
export class FormStorage {
  static STORAGE_KEY = "dynamic_form_data";

  static saveFormData(formData) {
    try {
      const dataToSave = {
        formData,
        timestamp: Date.now(),
        version: "1.0",
      };
      // Note: Using memory storage instead of localStorage for Claude.ai compatibility
      window.formStorageData = dataToSave;
    } catch (error) {
      console.error("Failed to save form data:", error);
    }
  }

  static loadFormData() {
    try {
      const data = window.formStorageData;
      if (data && data.formData) {
        return data.formData;
      }
    } catch (error) {
      console.error("Failed to load form data:", error);
    }
    return {};
  }

  static clearFormData() {
    try {
      delete window.formStorageData;
    } catch (error) {
      console.error("Failed to clear form data:", error);
    }
  }
}
