import db from "../database";

export interface SensorReading {
  time: string;
  name: string;
  value: number;
}

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
