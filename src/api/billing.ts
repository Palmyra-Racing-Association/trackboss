import { Request, Response, Router } from 'express';

const billing = Router();

billing.get('/yearlyWorkPointThreshold', (req: Request, res: Response) => {
    res.status(501).send();
});

billing.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

billing.post('/', (req: Request, res: Response) => {
    res.status(501).send();
});

billing.get('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

billing.post('/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default billing;
