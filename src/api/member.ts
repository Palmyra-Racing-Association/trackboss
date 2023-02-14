import { Request, Response, Router } from 'express';
import { checkHeader, validateAdminAccess, verify } from '../util/auth';
import {
    deleteFamilyMember,
    getEligibleVoters,
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
import { deleteCognitoUser } from '../util/cognito';
import { formatWorkbook, httpOutputWorkbook, startWorkbook } from '../excel/workbookHelper';

// this is here, in this way, because mailchimmp marketing doesn't have a proper typescript library and
// so as a result, i'm using it in a Javasript way.  Once the @types/mailchimp-markeing thing gets updated we
// can use that here. It doesn't really matter too much as I know what I am doing anyway and explinaed it here.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mailchimpClient = require('@mailchimp/mailchimp_marketing');

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
            await verify(headerCheck.token, 'Membership Admin');
            const insertId = await insertMember(req.body);
            response = await getMember(`${insertId}`);
            res.status(201);
        } catch (e: any) {
            logger.error('Error adding new member', e);
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
            logger.error(`Error at path ${req.path}`);
            logger.error(e);

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
            logger.error(`Error at path ${req.path}`);
            logger.error(e);

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
            logger.error(`Error at path ${req.path}`);
            logger.error(e);

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
            logger.error(`Error at path ${req.path}`);
            logger.error(e);

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

member.get('/list/voterEligibility/excel', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const rightNow = new Date();
        const eligibleVoters = await getEligibleVoters(rightNow.getFullYear());
        const workbookTitle = `Eligible Voters ${new Date().toLocaleDateString().replace(/\//gi, '-')}`;
        const workbook = startWorkbook(workbookTitle);
        const worksheet = workbook.getWorksheet(1);
        worksheet.columns = [
            { header: 'Last Name', key: 'lastName', width: 10 },
            { header: 'First Name', key: 'firstName', width: 15 },
            { header: 'Membership Type', key: 'membershipType', width: 15 },
            { header: 'Meetings Attended', key: 'meetingsAttended', width: 6 },
            { header: '% of meetings', key: 'percentageMeetings', width: 6 },
            { header: 'Points Earned', key: 'pointsEarned', width: 6 },
            { header: 'Eligible?', key: 'eligible', width: 6 },
            { header: 'Eligible By Points', key: 'eligibleByPoints', width: 6 },
            { header: 'Eligible By Meetings', key: 'eligibleByMeetings', width: 6 },
        ];
        eligibleVoters.forEach((voter: any) => {
            let isEligible;
            if (voter.membershipType === 'Associate Member') {
                isEligible = ((voter.eligibleByPoints === 'Yes') && (voter.eligibleByMeetings === 'Yes'));
            } else {
                isEligible = ((voter.eligibleByPoints === 'Yes') || (voter.eligibleByMeetings === 'Yes'));
            }
            const row = {
                lastName: voter.lastName,
                firstName: voter.firstName,
                membershipType: voter.membershipType,
                meetingsAttended: voter.meetingsAttended,
                percentageMeetings: voter.percentageMeetings,
                pointsEarned: voter.pointsEarned,
                eligible: isEligible ? 'Yes' : 'No',
                eligibleByPoints: voter.eligibleByPoints,
                eligibleByMeetings: voter.eligibleByMeetings,
            };
            worksheet.addRow(row);
        });
        formatWorkbook(worksheet);
        // write workbook to buffer.
        httpOutputWorkbook(workbook, res, `members${new Date().getTime()}`);
    } catch (error) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

member.post('/admin/reconcileMailList', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        mailchimpClient.setConfig({
            apiKey: process.env.MAILCHIMP,
            server: 'us15',
        });
        // magic numberism - this is the client ID that we are assigned by mailchimp because they only allow us one list
        const response = await mailchimpClient.lists.getListMembersInfo('099d152f4d', { count: 1000 });
        const mailchimpMembersList = response.members;
        logger.info(`running reconcilation on mailchimp vs trackboss. Mailchimp shows ${mailchimpMembersList.length}`);
        const removedEmails : object[] = [];
        const missingEmails : object[] = [];
        const result = {
            mailchimpRecordCount: mailchimpMembersList.length,
            trackbossFound: 0,
            mailchipRemoved: removedEmails,
            mailchimpMissing: missingEmails,
        };
        // not using forEach here because I want to build the response in sequence before sending it.
        // eslint-disable-next-line no-restricted-syntax
        for (const mailchimpMember of mailchimpMembersList) {
            // eslint-disable-next-line no-await-in-loop
            const memberByEmail = await getMemberByEmail(mailchimpMember.email_address);
            if (!memberByEmail.memberId) {
                logger.info(`${mailchimpMember.email_address} tagged for removal from mailchimp - not in trackboss.`);
                result.mailchipRemoved.push({
                    name: `${memberByEmail.lastName}, ${memberByEmail.firstName}`,
                    email: mailchimpMember.email_address,
                });
            } else {
                result.trackbossFound++;
            }
        }
        let activeMembers = await getMemberList({});
        activeMembers = activeMembers.filter((m) => m.active);

        // eslint-disable-next-line no-restricted-syntax
        for (const activeMember of activeMembers) {
            // check and see if the active member is already in mailchimp.
            const found = mailchimpMembersList.find((element:any) => (element.email_address === activeMember.email));
            if (!found && activeMember.email) {
                result.mailchimpMissing.push({
                    full_name: `${activeMember.firstName} ${activeMember.lastName}`,
                    email_address: activeMember.email,
                    merge_fields: {
                        FNAME: activeMember.firstName,
                        LNAME: activeMember.lastName,
                        PHONE: activeMember.phoneNumber,
                    },
                    status: 'subscribed',
                });
                // eslint-disable-next-line max-len
                logger.info(`${activeMember.firstName} ${activeMember.lastName} is not in mailchimp with ${activeMember.email}`);
            }
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

export default member;
