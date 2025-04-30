import ReadingsRepository, {IReadingsRepository} from "./readings.repository";
import {METRICS, SensorReading, ValidMetric} from "../types/sensors.types";
import db from "../database";

let repo: IReadingsRepository;

beforeEach(() => {
  db.resetDatabase();
  repo = new ReadingsRepository();
});

function createMockReading(date?: Date, name?: ValidMetric) {
  const idx = Math.floor(Math.random() * (METRICS.length));

  return {
    name: name ? name : METRICS[idx],
    time: date ? date.toISOString() : new Date().toISOString(),
    value: 2
  };
}

describe('getAllDays()', () => {
  test('should return an empty array initially', async () => {
    const res = await repo.getAllDays();

    expect(res.data).toEqual([]);
    expect(res.success).toBeTruthy();
  });
});

describe('addReading()', () => {
  test('adding a reading successfully should return success true if successful', async () => {
    const readingMock: SensorReading = createMockReading();
    const res = await repo.insertReadings([readingMock]);

    expect(res.success).toBeTruthy();
  });

  test('reading added should exist in the database', async () => {
    const readingMock: SensorReading = createMockReading();
    await repo.insertReadings([readingMock]);

    const allData = await repo.getAllDays();

    expect(allData.data).toHaveLength(1);
  });

  test('multiple readings should exist in the database', async () => {
    const lastReadingMock = createMockReading();
    const firstReadingMock = createMockReading(new Date(new Date(lastReadingMock.time).getTime() - 24 * 60 * 60 * 1000));

    await repo.insertReadings([firstReadingMock, lastReadingMock]);

    const allData = await repo.getAllDays();

    expect(allData.data).toHaveLength(2);
    expect(allData.data).toEqual([firstReadingMock, lastReadingMock]);
  });
});

describe('getReadings()', () => {
  test('should get all readings for given dateRange', async () => {
    const lastReadingMock = createMockReading();
    const firstReadingMock = createMockReading(new Date(new Date(lastReadingMock.time).getTime() - 24 * 60 * 60 * 1000));
    await repo.insertReadings([firstReadingMock, lastReadingMock]);

    const lastReadingDate = new Date(lastReadingMock.time);

    const res = await repo.getReadings(lastReadingDate, lastReadingDate);
    expect(res.success).toBeTruthy();
    if (res.success) {
      expect(res.data).toEqual([lastReadingMock]);
    } else {
      throw new Error('Success is False! Should be true');
    }
  });
});
