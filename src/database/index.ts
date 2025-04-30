import {SensorReading, ValidMetric} from "../types/sensors";

//
// type DailySensorReadingKey<T extends string> =
//   T extends `${infer _dateIso}_${ValidMetric}` ? T : never;

export type DailyKey = `${string}_${ValidMetric}`;

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const sensorData: Map<DailyKey, Map<string, SensorReading>> = new Map();

/**
 * Store a reading in the database using the given key
 */
export const addReading = (key: DailyKey, reading: SensorReading): SensorReading => {
  if (!sensorData.get(key)) {
    sensorData.set(key, new Map());
  }

  sensorData.get(key)!.set(reading.time, reading);

  return reading;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReadings = (from: Date, to: Date): SensorReading[] | undefined => {

  if (!sensorData.get(key)) {
    sensorData.set(key, new Map());
  }

  //sensorData.get(key)!.set()

  return [];
};

export const getAllDays = () => {
  const readings: SensorReading[] = [];

  for (const [key, values] of sensorData) {
    values.forEach(reading => {
      readings.push(reading);
    });
  }

  return readings;
};

/**
 * Reset the database by clearing all stored data
 */
export const resetDatabase = () => {
  sensorData.clear();
};

function parseDailyKey(dailyKey: string): string[] {
  const parsed = dailyKey.split('_');

  if (parsed.length !== 2) throw new Error('key not in correct format');

  return parsed;
}


const db = {
  addReading,
  getReadings,
  getAllDays,
  resetDatabase
};

export default db;
