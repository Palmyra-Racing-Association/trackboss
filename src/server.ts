import 'dotenv/config';
import express from 'express';
import AWS, { Connect } from 'aws-sdk';
import api from './api/api';
import logger from './logger';
import { createVerifier } from './util/auth';
import { getConnectionObject, getEnvironmentParameter } from './util/environmentWrapper';

process.on('uncaughtException', (error, origin) => {
    logger.error('----- Uncaught exception -----');
    logger.error(error);
    logger.error('----- Exception origin -----');
    logger.error(origin);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('----- Unhandled Rejection at -----');
    logger.error(promise);
    logger.error('----- Reason -----');
    logger.error(reason);
});

const app = express();

const port = process.env.PORT || 8080;

createVerifier();

AWS.config.update({ region: 'us-east-1' });

app.use('/api', api);
app.use((err: any, req: any, res: any, next: () => void) => {
    logger.error(`got an error going to ${req.route}.  That error was`);
    logger.error(err);
    next();
});

const server = app.listen(port, async () => {
    const envName = await getEnvironmentParameter('trackbossEnvironmentName');
    const connectionObject = await getConnectionObject();
    process.env.MYSQL_DB = connectionObject.dbname;
    process.env.MYSQL_HOST = connectionObject.host;
    process.env.MYSQL_USER = connectionObject.username;
    process.env.MYSQL_PASS = connectionObject.password;
    logger.info(`PRA Club Manager API environment ${envName} 
        listening on port ${port} on database at ${process.env.MYSQL_HOST}`);
});

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
