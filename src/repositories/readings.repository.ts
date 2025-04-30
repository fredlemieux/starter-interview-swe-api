import inMemoryDatabase, {DB} from "../database";
import {SensorReading, ValidMetric} from "../types/sensors.types";

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
  private db: DB;

  constructor(database: DB = inMemoryDatabase) {
    this.db = database;
  }

  async getAllDays() {
    const data = await this.db.getAllDays();
    return {
      success: true,
      data
    };
  }

  async getReadings(from: Date, to: Date): Promise<{ success: true; data: SensorReading[] } | {
    success: false;
    error: string
  }> {
    const readings = await this.db.getReadings(from, to);
    return {
      success: true,
      data: readings
    };
  }

  async insertReadings(readings: SensorReading[]): Promise<{ success: true; }> {
    for (let i = 0; i < readings.length; i++) { // This is an implementation detail that perhaps we want to keep in db?
      await this.db.addReading(readings[i]);
    }

    return {
      success: true
    };
  }
}
