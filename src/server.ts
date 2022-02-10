import express from 'express';
import api from './api/api';
import { getEvent, insertEvent } from './database/event';
import logger from './logger';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});

const fn = async () => {
    const i = 1;
    // const id = 11;
    // const id2 = 9;
    const req = {
        date: '1998/01/01',
        eventTypeId: 1,
        eventName: 'test',
        eventDescription: 'described',
    };
    logger.info(`${JSON.stringify(await getEvent(i))}`);
    logger.info(`${JSON.stringify(await insertEvent(req))}`);
};

fn();

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
