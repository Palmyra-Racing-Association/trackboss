import { Request, Response, Router } from 'express';

const job = Router();

job.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

job.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

job.get('/:jobID', (req: Request, res: Response) => {
    res.status(501).send();
});

job.patch('/:jobID', (req: Request, res: Response) => {
    res.status(501).send();
});

job.post('/:jobID', (req: Request, res: Response) => {
    res.status(501).send();
});

job.delete('/:jobID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default job;
