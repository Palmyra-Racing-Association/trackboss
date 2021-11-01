import { Request, Response, Router } from 'express';

const member = Router();

member.get('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.patch('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.delete('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.post('/:memberID/resetPassword', (req: Request, res: Response) => {
    res.status(501).send();
});

member.post('/:memberID/changePassword', (req: Request, res: Response) => {
    res.status(501).send();
});

export default member;
