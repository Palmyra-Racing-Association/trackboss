import { Request, Response, Router } from 'express';

const eventType = Router();

eventType.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

eventType.get('/:eventTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

eventType.patch('/:eventTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

eventType.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

export default eventType;
