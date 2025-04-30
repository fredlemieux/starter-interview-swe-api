import db, {DailyKey} from "../database";
import {SensorReading, ValidMetric} from "../types/sensors";

export interface IReadingsRepository {
  getAllDays(): Promise<{ success: boolean, data: SensorReading[] }>;

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
  async getAllDays() {
    const data = db.getAllDays();
    return {
      success: true,
      data
    };
  }

  async getReadings(from: Date, to: Date): Promise<{ success: true; data: SensorReading[] } | {
    success: false;
    error: string
  }> {
    const readings = await db.getReadings();
    return {
      success: true,
      data: []
    };
  }

  async insertReadings(readings: SensorReading[]): Promise<{ success: true; }> {
    for (let i = 0; i < readings.length; i++) { // This is an implementation detail that perhaps we want to keep in db?
      const key = this.createKey(readings[i]);
      await db.addReading(key, readings[i]);
    }

    return {
      success: true
    };
  }

  createKey({time, name}: SensorReading): DailyKey {
    const [date] = time.split('T');
    return `${date}_${name}`;
  }
}
