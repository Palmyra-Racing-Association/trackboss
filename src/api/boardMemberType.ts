import { Request, Response, Router } from 'express';

const boardMemberType = Router();

boardMemberType.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMemberType.get('/list', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMemberType.get('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMemberType.patch('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

boardMemberType.delete('/:boardMemberId', (req: Request, res: Response) => {
    res.status(501).send();
});

export default boardMemberType;
