import express from 'express';
import api from './api/api';
import logger from './logger';

const app = express();

const port = 8080;

app.use('/api', api);
app.listen(port, () => {
    logger.info(`PRA Club Manager API listening on port ${port}`);
});
