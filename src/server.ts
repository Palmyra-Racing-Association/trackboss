import express from 'express';
import api from './api/API';

const app = express();

const port = 3000;

app.use('/api', api);
app.listen(port, () => {
    console.log(`PRA Club Manager API listenting on port ${port}`);
});

export {};
