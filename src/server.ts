import express from 'express';
import api from './api/api';
import { getEvent, insertEvent, getEventList } from './database/event';
import logger from './logger';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
