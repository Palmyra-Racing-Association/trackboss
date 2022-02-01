import { Request, Response, Router } from 'express';

const memberType = Router();

memberType.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

memberType.get('/:memberTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

memberType.patch('/:memberTypeID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default memberType;
