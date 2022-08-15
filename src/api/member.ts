import { Request, Response, Router } from 'express';
import { checkHeader, verify } from '../util/auth';
import {
    deleteFamilyMember,
    getMember, getMemberByEmail, getMemberByPhone, getMemberList,
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
import { createCognitoUser, deleteCognitoUser } from '../util/cognito';

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
                logger.info(`Creating new user for email ${req.body.email} on membership ${req.body.membershipId}`);
                try {
                    const uuid = await createCognitoUser(req.body.email);
                    req.body.uuid = uuid;
                    logger.info(`Successfully created ${req.body.email} in cognito as ${uuid}`);
                } catch (error: any) {
                    logger.error(`Failure creating ${req.body.email} in cognito.  Continuing on trackboss side`);
                    logger.error(error);
                }
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

member.get('/email/:email', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMemberResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { email } = req.params;
            response = await getMemberByEmail(email);
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
            // if it's a family member ("member") and inactivated, then delete the cognito user
            // and the member record.  This is just cleanup stuff. and may change later.
            if (!response.active && (response.memberType === 'Member')) {
                try {
                    const removeCount = await deleteFamilyMember(response.memberId);
                    const userEmail = response.email;
                    logger.info(`Removed ${removeCount} rows for user ${response.email}`);
                    if (response.email) {
                        // use this loathesome promises hipster syntax here because I want this to run
                        // asychronously so the UI doesn't wait 5 seconds for the cognito delete to work.
                        deleteCognitoUser(response.uuid)
                            .then((
                                () => {
                                    logger.info(`Deactivated Cognito user for ${userEmail}`);
                                }))
                            .catch((error) => {
                                // eslint-disable-next-line max-len
                                logger.error(`Error deleting Cognito user ${userEmail}.  User will be abandoned in Cognito.`);
                                logger.error(error);
                            });
                    }
                } catch (error: any) {
                    logger.error('Error deleting user from database. Something is probably really wrong!');
                    logger.error(error);
                }
            }
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
