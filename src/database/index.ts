import {SensorReading, ValidMetric} from "../types/sensors.types";
import {dateKeysFromRange} from "../libs/dates";

//
// type DailySensorReadingKey<T extends string> =
//   T extends `${infer _dateIso}_${ValidMetric}` ? T : never;

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
 * Store a reading in the database using the given key
 */
export const addReading = async (reading: SensorReading): Promise<SensorReading> => {
  const [dateKey] = new Date(reading.time).toISOString().split("T");

  if (!sensorData.get(dateKey)) {
    sensorData.set(dateKey, new Map());
  }

  const metricsMap = sensorData.get(dateKey)!; // use type Narrowing and predicate to ensure we don't use !

  if (!metricsMap.get(reading.name)) {
    metricsMap.set(reading.name, new Map());
  }

  const readingData = metricsMap.get(reading.name)!;
  readingData.set(reading.time, reading);

  return reading;
};

/**
 * Retrieve a reading from the database using the given key
 */
export const getReadings = async (from: Date, to: Date): Promise<SensorReading[]> => {
  const dateKeys = dateKeysFromRange(from, to);

  return dateKeys.flatMap(key => {
    const metricsMap = sensorData.get(key);

    if (!metricsMap) return [];

    return Array.from(metricsMap.values())
      .flatMap(readingsMap => {
        return Array.from(readingsMap.values());
      });
  });
};

export const getAllDays = async () => {
  const readings: SensorReading[] = [];

  sensorData.forEach(metricMaps => {
    metricMaps.forEach(readingMaps => {
      readingMaps.forEach(reading => {
        readings.push(reading);
      });
    });
  });
  return readings;
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
