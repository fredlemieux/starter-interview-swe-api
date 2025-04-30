export const METRICS = ["VOLTAGE", "CURRENT"] as const;
type ValidMetric = typeof METRICS[number];

export interface SensorReading {
  time: string;
  name: ValidMetric;
  value: number;
}
