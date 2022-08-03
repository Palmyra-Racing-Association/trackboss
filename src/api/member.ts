import { Request, Response, Router } from 'express';
import AWS from 'aws-sdk';
import { checkHeader, verify } from '../util/auth';
import {
    getMember, getMemberByPhone, getMemberList,
    insertMember, MEMBER_TYPE_MAP, patchMember,
} from '../database/member';
import {
    GetMemberListFilters,
    GetMemberListResponse,
    GetMemberResponse,
    Member,
    PatchMemberResponse,
    PostNewMemberResponse,
} from '../typedefs/member';
import logger from '../logger';

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
            if (req.body.email) {
                logger.info(`Creating new user for email ${req.body.email}`);
                AWS.config.update({ region: 'us-east-1' });
                const poolId = process.env.COGNITO_POOL_ID || '';
                const cognitoIdp = new AWS.CognitoIdentityServiceProvider();
                const createResponse = await cognitoIdp.adminCreateUser({
                    UserPoolId: poolId,
                    Username: req.body.email,
                }).promise();
                logger.info(createResponse);
                req.body.uuid = createResponse.User?.Username;
                const groupResponse = await cognitoIdp.adminAddUserToGroup({
                    UserPoolId: poolId,
                    GroupName: 'member',
                    Username: req.body.uuid,
                }).promise();
            }
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
            } else if (e.message === 'Forbidden') {
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
            const membershipFilter: string | undefined = req.query.membershipId as string;
            const membershipNum = Number(membershipFilter);
            const filters: GetMemberListFilters = {};
            if (!MEMBER_TYPE_MAP.has(filterRole) && typeof filterRole !== 'undefined') {
                res.status(400);
                response = { reason: 'invalid role specified' };
            } else if (Number.isNaN(membershipNum) && typeof membershipFilter !== 'undefined') {
                res.status(400);
                response = { reason: 'invalid membership id' };
            } else {
                if (typeof filterRole !== 'undefined') {
                    filters.type = filterRole;
                }
                if (typeof membershipFilter !== 'undefined') {
                    filters.membershipId = membershipNum;
                }
                const memberList: Member[] = await getMemberList(filters);
                res.status(200);
                response = memberList;
            }
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
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

member.get('/phone/:phoneNumber', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { phoneNumber } = req.params;
            response = await getMemberByPhone(phoneNumber);
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
            } else if (e.message === 'Forbidden') {
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
