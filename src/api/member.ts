import { Request, Response, Router } from 'express';
import { getMemberList, MEMBER_TYPE_MAP } from '../database/member';
import { GetMemberListResponse, Member } from '../typedefs/member';

const member = Router();

member.post('/new', (req: Request, res: Response) => {
    res.status(501).send();
});

member.get('/list', async (req: Request, res: Response) => {
    // TODO: check auth
    let response: GetMemberListResponse;
    try {
        const filterRole: string | undefined = req.query.role as string;
        if (!MEMBER_TYPE_MAP.has(filterRole) && typeof filterRole !== 'undefined') {
            res.status(400);
            response = { reason: 'invalid role specified' };
        } else {
            const memberList: Member[] = await getMemberList(filterRole);
            res.status(200);
            response = memberList;
        }
    } catch (e: any) {
        res.status(500);
        response = { reason: 'internal server error' };
    }
    res.send(response);
});

member.get('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

member.patch('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default member;
