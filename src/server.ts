import express from 'express';
import api from './api/api';
import logger from './logger';

import { getJobList } from './database/job';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});

const fn = async () => {
    logger.info(`${JSON.stringify(await getJobList(0, 1, undefined, undefined, 1, '2020-01-10'))}`);
};

fn();

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
