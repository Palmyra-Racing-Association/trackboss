import { Request, Response, Router } from 'express';
import {
    cleanMembershipTags,
    createMembershipTag,
    deleteMembershipTag,
    getMembership,
    getMembershipList,
    getMembershipTags,
    getRegistration,
    insertMembership,
    patchMembership,
    registerMembership,
} from '../database/membership';
import {
    GetMembershipListResponse,
    GetMembershipResponse,
    Membership,
    PatchMembershipResponse,
    PostNewMembershipResponse,
    PostRegisterMembershipResponse,
} from '../typedefs/membership';
import { checkHeader, validateAdminAccess, verify } from '../util/auth';
import logger from '../logger';
import { ErrorResponse } from '../typedefs/errorResponse';
import { MembershipTag } from '../typedefs/membershipTag';
import { getMemberByEmail } from '../database/member';
import { Member } from '../typedefs/member';

// this is here, in this way, because mailchimp marketing doesn't have a proper typescript library and
// so as a result, i'm using it in a Javasript way.  Once the @types/mailchimp-markeing thing gets updated we
// can use that here. It doesn't really matter too much as I know what I am doing anyway and explinaed it here.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailchimpClient = require('@mailchimp/mailchimp_marketing');

const membership = Router();

membership.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostNewMembershipResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const insertId = await insertMembership(req.body);
            response = await getMembership(insertId);
            res.status(201);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
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

membership.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMembershipListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { status } = req.query;
            const membershipList: Membership[] = await getMembershipList(status as string);
            res.status(200);
            response = membershipList;
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
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

// This request does not require authentication.
membership.post('/register', async (req: Request, res: Response) => {
    let response: PostRegisterMembershipResponse;
    try {
        const insertId = await registerMembership(req.body);
        response = await getRegistration(insertId);
        res.status(201);
    } catch (e: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(e);
        if (e.message === 'user input error') {
            res.status(400);
            response = { reason: 'bad request' };
        } else {
            res.status(500);
            response = { reason: 'internal server error' };
        }
    }
    res.send(response);
});

membership.get('/:membershipID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMembershipResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { membershipID } = req.params;
            response = await getMembership(Number(membershipID));
            res.status(200);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

membership.patch('/:membershipID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PatchMembershipResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            const { membershipID } = req.params;
            const membershipIdNum = Number(membershipID);
            if (Number.isNaN(membershipIdNum)) {
                throw new Error('not found');
            }
            await verify(headerCheck.token, 'Membership Admin');
            await patchMembership(membershipIdNum, req.body);
            response = await getMembership(membershipIdNum);
            res.status(200);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
            if (e.message === 'user input error') {
                res.status(400);
                response = { reason: 'bad request' };
            } else if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'Forbidden') {
                res.status(403);
                response = { reason: 'forbidden' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

membership.post('/tags', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: MembershipTag[] | ErrorResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { membershipId, tags } = req.body;
            response = await createMembershipTag(membershipId, tags);
            res.status(200);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

membership.get('/tags/:membershipID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: MembershipTag[] | ErrorResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { membershipID } = req.params;
            response = await getMembershipTags(Number(membershipID));
            res.status(200);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

membership.delete('/tags', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: MembershipTag[] | ErrorResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            const { membershipId, tags } = req.body;
            response = await deleteMembershipTag(membershipId, tags);
            res.status(200);
        } catch (e: any) {
            logger.error(`Error at path ${req.path}`);
            logger.error(e);
            if (e.message === 'Authorization Failed') {
                res.status(401);
                response = { reason: 'not authorized' };
            } else if (e.message === 'not found') {
                res.status(404);
                response = { reason: 'not found' };
            } else {
                res.status(500);
                response = { reason: 'internal server error' };
            }
        }
    }
    res.send(response);
});

membership.post('/admin/copyTags', async (req: Request, res: Response) => {
    try {
        logger.info(`Running the ${req.path} with a ${req.method} request`);
        await validateAdminAccess(req, res);
        mailchimpClient.setConfig({
            apiKey: process.env.MAILCHIMP,
            server: 'us15',
        });
        // magic numberism - this is the client ID that we are assigned by mailchimp because they only allow us one list
        const response = await mailchimpClient.lists.getListMembersInfo('099d152f4d', { count: 1000 });
        logger.info(`Got ${response.length} members in mailchimp`);
        const mailchimpMembersList = response.members;
        const result: any[] = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const mailchimpMember of mailchimpMembersList) {
            const mcTags : string[] = [];
            mailchimpMember.tags.forEach((tag :any) => {
                mcTags.push(tag.name);
            });
            // eslint-disable-next-line no-await-in-loop
            const member : Member = await getMemberByEmail(mailchimpMember.email_address);
            logger.info(`Found ${member.lastName} for email address ${mailchimpMember.email_address}`);
            logger.info('Getting mailchimp tags for them.');
            if (member) {
                result.push({
                    name: `${member.lastName}, ${member.firstName}`,
                    membershipId: member.membershipId,
                    email: mailchimpMember.email_address,
                    tags: mcTags,
                });
            }
            logger.info('Cleaning all membership tags to take the import from mailchimp');
            // eslint-disable-next-line no-await-in-loop
            await cleanMembershipTags(member.membershipId);
            // eslint-disable-next-line no-await-in-loop
            await createMembershipTag(member.membershipId, mcTags);
        }
        res.status(200);
        res.send(result);
    } catch (error) {
        logger.error(`Error running mailchimp/trackboss reconciliation at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

export default membership;
