import { Request, Response, Router } from 'express';
import { checkHeader, verify } from '../util/auth';
import { getMember, getMemberList, insertMember, MEMBER_TYPE_MAP, patchMember } from '../database/member';
import {
    GetMemberListResponse,
    GetMemberResponse,
    Member,
    PatchMemberResponse,
    PostNewMemberResponse,
} from '../typedefs/member';

const member = Router();

member.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertMember(req.body);
            response = await getMember(`${insertId}`);
            res.status(201);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Not Authorized') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

member.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
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
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

member.get('/:memberId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { memberId } = req.params;
            response = await getMember(memberId);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

member.patch('/:memberId', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { memberId } = req.params;
            await verify(headerCheck.token, 'Membership Admin', Number(memberId));
            await patchMember(memberId, req.body);
            response = await getMember(memberId);
            res.status(200);
        } catch (e: any) {
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Not Authorized') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

export default member;
