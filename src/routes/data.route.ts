import {Router, Request, Response} from 'express';
import {parseReadingsPayload} from "../libs/readings-parser";
import ReadingsRepository from "../repositories/readings.repository";

export const dataRoute = Router();
const readingsRepo = new ReadingsRepository();

dataRoute.post('/data', async (req: Request<{}, {}, string, {}, {}>, res) => {
  const payload = req.body;

  if (payload.length === 0) {
    return res.status(400).json({success: false, error: "No data in body"});
  }

  const parsedReadings = parseReadingsPayload(payload);

  if (parsedReadings.length === 0) {
    return res.status(400).json({success: false, error: "No valid data"}); // TODO! improve error reporting (add errors to parser response)
  }

  const dbRes = await readingsRepo.insertReadings(parsedReadings);

  if (dbRes.success) {
    return res.status(200).json({success: true});
  } else {
    return res.status(404).json({success: false});
  }
});

dataRoute.get('/data', async (req: Request<{}, {}, {}, { to: string; from: string; }>, res) => {
  // TODO: check what dates have been requested, and retrieve all data within the given range
  const queryParams = req.query;
  const from = new Date(queryParams.from);
  const to = new Date(queryParams.to);
  if (isNaN(from.getDate()) || isNaN(to.getDate())) {
    return res.status(400).json({
      success: false,
      error: "to and from query params need to be in ISO date format!!"
    });
  }

  const readingsData = await readingsRepo.getReadings(from, to);

  return res.json({success: false, data: readingsData});
});
