import express, { Request, Response } from 'express';

const membership = express.Router();

membership.get('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.patch('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

membership.post('/register', (req: Request, res: Response) => {
    res.status(501).send();
});

export default membership;
