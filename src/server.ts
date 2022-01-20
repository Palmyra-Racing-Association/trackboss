import express from 'express';
import { createLogger, format, transports } from 'winston';
import api from './api/api';

const app = express();

const port = 8080;

const { combine, timestamp: timestampFn, label: labelFn, printf } = format;
const myFormat =
    printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`);

const logger = createLogger({
    format: combine(
        labelFn({ label: 'Club Manager' }),
        timestampFn({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat,
    ),
    transports: [new transports.Console()],
});

app.use('/api', api);
app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});

export {};
