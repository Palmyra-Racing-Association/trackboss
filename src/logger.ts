// Object to handle all logging in the backend
//
// Example log:
// 2022-01-19 23:23:41 [Club Manager] info: PRA Club Manager API listening on port 8080

import { createLogger, format, transports } from 'winston';

const { combine, timestamp: timestampFn, label: labelFn, printf } = format;
const logFormat =
    printf(({ level, message, label, timestamp }) => `${timestamp} [${label}] ${level}: ${message}`);

const logger = createLogger({
    format: combine(
        labelFn({ label: 'Club Manager' }),
        timestampFn({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [new transports.Console()],
});

export default logger;
