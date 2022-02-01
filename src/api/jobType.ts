import { Request, Response, Router } from 'express';

const jobType = Router();

jobType.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

jobType.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

jobType.get('/:jobTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

jobType.patch('/:jobTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default jobType;
