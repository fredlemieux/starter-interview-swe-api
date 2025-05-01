import {SensorReading, ValidMetric} from "../types/sensors.types";
import {dateKeysFromRange} from "../libs/dates";

export type ISODate = string;
export type ISODateTime = string;

export interface DB {
  getAllDays(): Promise<SensorReading[]>;

  getReadings(from: Date, to: Date): Promise<SensorReading[]>;

  addReading(reading: SensorReading): Promise<SensorReading>;

  resetDatabase(): void;
}

// This is a fake database which stores data in-memory while the process is running
// Feel free to change the data structure to anything else you would like
const sensorData: Map<ISODate, Map<ValidMetric, Map<ISODateTime, SensorReading>>> = new Map();

/**
 * Store a reading in the database
 */
export const addReading = async (reading: SensorReading): Promise<SensorReading> => {
  const [dateKey] = new Date(reading.time).toISOString().split("T");

  let metricsMap = sensorData.get(dateKey);
  if (!metricsMap) {
    metricsMap = new Map();
    sensorData.set(dateKey, metricsMap);
  }


  let readingsMap = metricsMap.get(reading.name);
  if (!readingsMap) {
    readingsMap = new Map();
    metricsMap.set(reading.name, readingsMap);
  }

  readingsMap.set(reading.time, reading);

  return reading;
};

/**
 * Retrieve a readings from a range of dates
 */
export const getReadings = async (from: Date, to: Date): Promise<SensorReading[]> => {
  const dateKeys = dateKeysFromRange(from, to);

  return dateKeys.flatMap(key => {
    const metricsMap = sensorData.get(key);

    if (!metricsMap) return [];

    return Array.from(metricsMap.values())
      .flatMap(readingsMap => Array.from(readingsMap.values()));
  });
};

/**
 * Get all data from the database (useful for testing)
 */
export const getAllDays = async (): Promise<SensorReading[]> => {
  return Array.from(sensorData.values())
    .flatMap(metricMaps => Array.from(metricMaps.values())
      .flatMap(readingsMaps => Array.from(readingsMaps.values())));
};

/**
 * Reset the database by clearing all stored data
 */
export const resetDatabase = () => {
  sensorData.clear();
};

const inMemoryDatabase: DB = {
  addReading,
  getReadings,
  getAllDays,
  resetDatabase
};

export default inMemoryDatabase;
