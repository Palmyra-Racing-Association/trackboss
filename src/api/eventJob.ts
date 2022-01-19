import { Request, Response, Router } from 'express';

const eventJob = Router();

eventJob.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

eventJob.get('/:eventJobID', (req: Request, res: Response) => {
    res.status(501).send();
});

eventJob.patch('/:eventJobID', (req: Request, res: Response) => {
    res.status(501).send();
});

eventJob.delete('/:eventJobID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default eventJob;
