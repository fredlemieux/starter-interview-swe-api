import express, {Express} from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import {dataRoute} from "./routes/data.route";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(express.text());
app.use(express.urlencoded({extended: true}));
app.use('/', dataRoute);

app.listen(PORT, () => console.log(`Running on port ${PORT} ⚡`));
