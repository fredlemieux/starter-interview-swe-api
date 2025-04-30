import ReadingsRepository, {IReadingsRepository} from "./readings.repository";
import {SensorReading} from "../types/sensors";
import db from "../database";

let repo: IReadingsRepository;

beforeEach(() => {
  db.resetDatabase();
  repo = new ReadingsRepository();
});

describe('getAllDays()', () => {
  test('should return an empty array initially', async () => {
    const res = await repo.getAllDays();

    expect(res.data).toEqual([]);
    expect(res.success).toBeTruthy();
  });
});

describe('addReading()', () => {
  test('adding a reading successfully should return success true if successful', async () => {
    const reading: SensorReading = {name: "CURRENT", time: new Date().toISOString(), value: 123};
    const res = await repo.insertReadings([reading]);

    expect(res.success).toBeTruthy();
  });

  test('reading added should exist in the database', async () => {
    const reading: SensorReading = {name: "CURRENT", time: new Date().toISOString(), value: 123};
    await repo.insertReadings([reading]);

    const allData = await repo.getAllDays();

    expect(allData.data).toHaveLength(1);
  });
});
