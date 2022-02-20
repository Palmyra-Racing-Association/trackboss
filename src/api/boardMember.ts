import { Request, Response, Router } from 'express';

const boardMember = Router();

boardMember.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMember.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMember.get('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMember.patch('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMember.delete('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

export default boardMember;
