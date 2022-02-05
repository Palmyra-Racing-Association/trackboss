import express from 'express';
import api from './api/api';
import { getEventType, insertEventType, patchEventType } from './database/eventType';
import logger from './logger';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    //logger.info(`PRA Club Manager API listening on port ${port}`);
});

const fn = async () => {
    const i = 8;
    const id = 11;
    const id2 = 12;
    const req = {
        'type': 'abcd', 
        'modifiedBy': 2
    };
    //logger.info(`${JSON.stringify(await patchEventType(id, req))}`);
    //logger.info(`${JSON.stringify(await getEventType(i))}`);
    //logger.info(`${JSON.stringify(await getEventType(id2))}`);
};

fn();

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
