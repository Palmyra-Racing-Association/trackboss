import { Request, Response, Router } from 'express';

const member = Router();

member.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

member.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

member.get('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.patch('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.delete('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default member;
