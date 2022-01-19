import { Request, Response, Router } from 'express';

const membership = Router();

membership.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.get('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.patch('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.post('/register', (req: Request, res: Response) => {
    res.status(501).send();
});

export default membership;
