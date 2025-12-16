const STORAGE_KEY = 'studentData';

/**
 * Represents the default structure for a new student's data.
 */
const defaultUserData = {
  acquisitions: {}, // e.g., { "AC1201": { "percentage": 75, "validated": false } }
  history: [],      // e.g., { "ac": "AC1201", "percentage": 75, "date": "..." }
};

/**
 * Loads the student's data from localStorage.
 * If no data is found, returns a default empty state.
 * @returns {object} The student's data.
 */
export const loadUserData = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load or parse user data from localStorage:", error);
  }
  // Return a copy of the default object to avoid mutation of the original
  return { ...defaultUserData, acquisitions: {}, history: [] };
};

/**
 * Saves the student's data to localStorage.
 * @param {object} userData - The student's data object to save.
 */
export const saveUserData = (userData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error("Failed to save user data to localStorage:", error);
  }
};

/**
 * Updates the acquisition percentage for a specific AC, records the change in history,
 * and saves everything to localStorage.
 * @param {string} acId - The ID of the Apprentissage Critique (e.g., "AC1201").
 * @param {number} percentage - The new acquisition percentage (0-100).
 */
export const updateAcquisition = (acId, percentage) => {
  const userData = loadUserData();

  // Ensure percentage is within bounds
  const newPercentage = Math.max(0, Math.min(100, percentage));

  // Update the current percentage and validation status
  userData.acquisitions[acId] = { 
    percentage: newPercentage,
    validated: newPercentage === 100
  };

  // Add to history
  userData.history.push({
    ac: acId,
    percentage: newPercentage,
    date: new Date().toISOString(),
  });

  saveUserData(userData);
  
  console.log(`Updated ${acId} to ${newPercentage}%. Data saved.`);
  
  // Dispatch a custom event to notify other parts of the app of the change
  window.dispatchEvent(new CustomEvent('userDataChanged', { detail: userData }));
};

/**
 * Exports the user data as a JSON file.
 */
export const exportUserData = () => {
  const userData = loadUserData();
  const dataStr = JSON.stringify(userData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `progression-data-${new Date().toISOString().slice(0,10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}
