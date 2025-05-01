import {METRICS, SensorReading, ValidMetric} from "../types/sensors.types";

export function parseReadingsPayload(payload: string) {
  const lines = payload.split('\n');

  const parsedData: SensorReading[] = [];
  lines.forEach((line, index) => {
    try {
      parsedData.push(validateAndParse(line, index + 1));
    } catch (e) {
      console.error(e);
    }
  });

  // Todo return errors if any of the lines parsed incorrectly
  // Todo maybe have a strict and leniant flag?
  return parsedData;
}

function validateAndParse(line: string, row: number): SensorReading {
  const splitLine = line.split(' ');
  if (splitLine.length !== 3) {
    throw new Error(`Error on row: ${row}, incorrect format ${line}`);
  }

  const [timeUnix, name, valueStr] = splitLine;

  const date = new Date(Number(timeUnix) * 1000);

  if (isNaN(date.getDate())) {
    throw new Error(`Row: ${row} has time: ${date}  in incorrect format`);
  }

  if (!isMetricValid(name)) {
    throw new Error(`Row: ${row} has metric ${name} which is not one of allowed: ${METRICS}`);
  }

  const value = Number(valueStr);

  if (isNaN(value)) {
    throw new Error(`Value: ${value} on row: ${row} is not a number!`);
  }

  return {
    time: date.toISOString(),
    name,
    value
  };
}

const METRIC_SET = new Set(METRICS);

function isMetricValid(metric: string): metric is ValidMetric {
  return METRIC_SET.has(metric as ValidMetric); // This has O(1) compared to Array.includes()
}
