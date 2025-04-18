import {Router} from 'express';

export const dataRoute = Router();

dataRoute.post('/data', async (req, res) => {
  // TODO: parse incoming data, and save it to the database
  // data is of the form:
  //  {timestamp} {name} {value}

  // addReading(...)

  return res.json({success: false});
});

dataRoute.get('/data', async (req, res) => {
  // TODO: check what dates have been requested, and retrieve all data within the given range

  // getReading(...)

  return res.json({success: false});
});
