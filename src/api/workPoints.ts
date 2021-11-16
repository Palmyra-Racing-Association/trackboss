import { Request, Response, Router } from 'express';

const workPoints = Router();

workPoints.get('/byMember/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

workPoints.get('/byMembership/:membershipID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default workPoints;
