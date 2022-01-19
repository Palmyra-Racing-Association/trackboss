import { Request, Response, Router } from 'express';

const bike = Router();

bike.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.get('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.patch('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.delete('/:bikeID', (req: Request, res: Response) => {
    res.status(501).send();
});

bike.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

export default bike;
