import { Request, Response, Router } from 'express';

const event = Router();

event.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

event.get('/:eventID', (req: Request, res: Response) => {
    res.status(501).send();
});

event.patch('/:eventID', (req: Request, res: Response) => {
  res.status(501).send();
});

event.delete('/:eventID', (req: Request, res: Response) => {
  res.status(501).send();
});

event.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

export default event;
