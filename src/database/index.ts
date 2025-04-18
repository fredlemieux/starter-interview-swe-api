interface Reading {
  // TODO: change this to contain whatever information is needed
}

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const index: Record<string, Reading> = {};

/**
 * Store a reading in the database using the given key
 */
export const addReading = (key: string, reading: Reading): Reading => {
  index[key] = reading;
  return reading;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReadings = (key: string): Reading | undefined => {
  return index[key];
};


const db = {
  addReading,
  getReadings
}

export default db
