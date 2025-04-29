import db from "../database";
import {SensorReading} from "../types/sensors";


interface IReadingsRepository {
  getReadings(from: Date, to: Date): Promise<{ success: true, data: SensorReading[] } | {
    success: false,
    error: string
  }>;

  insertReadings(readings: SensorReading[]): Promise<{ success: true } | {
    success: false,
    error: string
  }>;
}

export default class ReadingsRepository implements IReadingsRepository {
  async getReadings(from: Date, to: Date): Promise<{ success: true; data: SensorReading[] } | {
    success: false;
    error: string
  }> {
    // const readings = await db.getReadings()
    return {
      success: true,
      data: []
    };
  }

  async insertReadings(readings: SensorReading[]): Promise<{ success: true; }> {

    return {
      success: true
    };
  }
}
