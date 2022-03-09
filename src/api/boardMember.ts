import { Request, Response, Router } from 'express';
import { PostNewBoardMemberResponse } from 'src/typedefs/boardMember';
import { getBoardMember, insertBoardMember } from '../database/boardMember';
import { checkHeader, verify } from '../util/auth';

const boardMember = Router();

boardMember.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewBoardMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertBoardMember(req.body);
            console.log(insertId);
            response = await getBoardMember(insertId);
            res.status(201);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                console.log(e);
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
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
