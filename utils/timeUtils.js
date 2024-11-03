export const saveToLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    // Check for undefined value
    if (value === undefined) {
      console.warn(`Cannot save undefined value for key: ${key}`);
      return;
    }

    try {
      // Attempt to stringify the value before saving
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage for key "${key}":`, error);
    }
  }
};

export const getFromLocalStorage = (key, defaultValue = 0) => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(key);
      // Check if saved is null before parsing
      if (saved === null) {
        return defaultValue; // Key not found, return default value
      }

      // If we reach here, saved is not null. Let's parse it.
      return JSON.parse(saved);
    } catch (error) {
      console.error(
        `Error retrieving from localStorage for key "${key}":`,
        error
      );
      return defaultValue; // Return default value in case of error
    }
  }
  return defaultValue; // Return default value if window is not defined
};
