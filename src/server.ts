import 'dotenv/config';
import express from 'express';
import AWS from 'aws-sdk';
import api from './api/api';
import logger from './logger';
import { createVerifier } from './util/auth';

const app = express();

const port = process.env.PORT || 8080;

createVerifier();

AWS.config.update({ region: 'us-east-1' });

app.use('/api', api);

const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
