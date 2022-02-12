import { Request, Response, Router } from 'express';
import { getMember, getMemberList, insertMember, MEMBER_TYPE_MAP } from '../database/member';
import {
    GetMemberListResponse,
    GetMemberResponse,
    Member,
    PostNewMemberResponse,
} from '../typedefs/member';

const member = Router();

member.post('/new', async (req: Request, res: Response) => {
    // TODO: check auth
    let response: PostNewMemberResponse;
    try {
        const insertId = await insertMember(req.body);
        response = await getMember(`${insertId}`);
        res.status(201);
    } catch (e: any) {
        console.log(e);
        res.status(500);
        response = { reason: 'internal server error' };
    }
    res.send(response);
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

member.get('/:memberId', async (req: Request, res: Response) => {
    // TODO: check auth
    let response: GetMemberResponse;
    try {
        const { memberId } = req.params;
        response = await getMember(memberId);
        res.status(200);
    } catch (e: any) {
        if (e.message === 'not found') {
            res.status(404);
            response = { reason: 'not found' };
        } else {
            res.status(500);
            response = { reason: 'internal server error' };
        }
    }
    res.send(response);
});

member.patch('/:memberID', (req: Request, res: Response) => {
    res.status(501).send();
});

export default member;
