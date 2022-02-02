import express from 'express';
import api from './api/api';
import { patchBike } from './database/bike';
import logger from './logger';

const app = express();

const port = process.env.PORT || 8080;

app.use('/api', api);
const server = app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});
const fn = async () => {
    const id = 104;
    const req = {};
    //logger.info(`${JSON.stringify(await patchBike(id, req))}`);
};

fn();

// export the HTTP server so that it can be closed if necessary (mostly for testing)
export default server;
