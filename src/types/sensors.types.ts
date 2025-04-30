export const METRICS = ["VOLTAGE", "CURRENT"] as const;
export type ValidMetric = typeof METRICS[number];

export interface SensorReading {
  time: string;
  name: ValidMetric;
  value: number;
}
