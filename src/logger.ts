import { createLogger, format, transports } from 'winston';

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

export default logger;
