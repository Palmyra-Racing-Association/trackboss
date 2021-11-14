import express from 'express';
import api from './api/api';

const app = express();

const port = 3000;

app.use('/api', api);
app.listen(port, () => {
    // TODO #36: replace this console.log with a logger, remove the ESLint suppressor
    // eslint-disable-next-line no-console
    console.log(`PRA Club Manager API listenting on port ${port}`);
});

export {};
