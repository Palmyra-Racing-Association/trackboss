import { Request, Response, Router } from 'express';
import PDFDocument from 'pdfkit';
import { checkHeader, validateAdminAccess, verify } from '../util/auth';
import {
    deleteFamilyMember,
    getEligibleVoters,
    getMember, getMemberByEmail, getMemberByPhone, getMemberList,
    getMembersWithTag,
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
import { deleteCognitoUser, updateCognitoUserEmail } from '../util/cognito';
import { formatWorkbook, httpOutputWorkbook, startWorkbook } from '../excel/workbookHelper';
import { markMembershipFormer } from '../database/membership';
import { getBoardMemberList } from '../database/boardMember';

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
    const tagParam = req.query.tag as string;
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
            } else if (tagParam) {
                const list = await getMembersWithTag(tagParam);
                res.status(200);
                response = list;
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
            const updatedMember = await getMember(memberId);
            response = updatedMember;
            // if it's a family member ("member") and inactivated, then delete the cognito user
            // and the member record.  This is just cleanup stuff. and may change later.
            if (!updatedMember.active && (updatedMember.memberType === 'Member')) {
                try {
                    const removeCount = await deleteFamilyMember(updatedMember.memberId);
                    const userEmail = updatedMember.email;
                    logger.info(`Removed ${removeCount} rows for user ${updatedMember.email}`);
                    if (updatedMember.email) {
                        // use this loathesome promises hipster syntax here because I want this to run
                        // asychronously so the UI doesn't wait 5 seconds for the cognito delete to work.
                        deleteCognitoUser(updatedMember.uuid)
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
            if (!updatedMember.active && (updatedMember.memberId === updatedMember.membershipAdminId)) {
                // if this is the membership admin then we are de-activating the whole membership.
                // Set Membership to former
                const id = await markMembershipFormer(
                    updatedMember.membershipId,
                    req.body.deactivationReason || '',
                );
                // eslint-disable-next-line max-len
                logger.info(`${updatedMember.firstName} ${updatedMember.lastName} set to Former member, reason code ${req.body.deactivationReason}`);
                // not all members have users, especially older ones who are still in our data, so check for dat.
                if (updatedMember.uuid) {
                    deleteCognitoUser(updatedMember.uuid)
                        .then((
                            () => {
                                logger.info(`Deactivated Cognito user for ${updatedMember.email}`);
                            }))
                        .catch((error) => {
                            // eslint-disable-next-line max-len
                            logger.error(`Error deleting Cognito user ${updatedMember.email}.  User will be abandoned in Cognito.`);
                            logger.error(error);
                        });
                }
            }
            if (updatedMember.email) {
                // more loathesome hipster garbage for dealing with cognito's slowness.  Not sure which I like less -
                // nested hipster promise syntax, or slow back ends that require it.  probably a tie.
                updateCognitoUserEmail(updatedMember)
                    .then((
                        () => {
                            logger.info(`Changed user email for ${updatedMember.memberId} to ${updatedMember.email}`);
                        }
                    ))
                    .catch((error) => {
                        logger.error(`Error updating Cognito user email for member ID ${updatedMember.memberId}.`);
                        logger.error('As a result their login is probably broken now.');
                        logger.error(error);
                    });
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
            csv: '',
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
        activeMembers = activeMembers.filter((m) => (m.active && m.email));

        // eslint-disable-next-line no-restricted-syntax
        for (const activeMember of activeMembers) {
            // check and see if the active member is already in mailchimp.
            // chose between a long line and a style change. I choose style.
            // eslint-disable-next-line arrow-body-style
            const found = mailchimpMembersList.find((element:any) => {
                return (element.email_address.toLowerCase() === activeMember.email.toLowerCase());
            });
            const { firstName, lastName, phoneNumber, email } = activeMember;
            if (!found && activeMember.email && (activeMember.memberId === activeMember.membershipAdminId)) {
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
                result.csv += `${firstName},${lastName},${phoneNumber},${email}`;
                result.csv += '|';
                // eslint-disable-next-line max-len
                logger.info(`${firstName} ${lastName} is not in mailchimp with ${email}`);
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

member.get('/card/create/:memberId', async (req: Request, res: Response) => {
    const { memberId } = req.params;
    const authorization = req.query.id as string;
    checkHeader(authorization);
    const headerCheck = checkHeader(`Bearer ${authorization}`);
    if (!headerCheck.valid) {
        res.status(401);
    } else {
        await verify(headerCheck.token, 'Member', Number(memberId));
        const memberForCard = await getMember(memberId);
        const boardMembers = await getBoardMemberList(new Date().getFullYear().toString());
        const president = boardMembers.find((m) => m.title === 'President');

        // Create a PDF document
        const doc = new PDFDocument();

        // Set response headers for PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename=PRAmembershipCard.pdf');

        // Pipe the PDF content to the response stream
        doc.pipe(res);
        // Draw border around the page
        const borderWidth = 100;
        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Top border
        doc.moveTo(0, 0).lineTo(pageWidth, 0).lineWidth(borderWidth).stroke();

        // Right border
        doc.moveTo(pageWidth, 0).lineTo(pageWidth, pageHeight).lineWidth(borderWidth).stroke();

        // Bottom border
        doc.moveTo(pageWidth, pageHeight).lineTo(0, pageHeight).lineWidth(borderWidth).stroke();

        // Left border
        doc.moveTo(0, pageHeight).lineTo(0, 0).lineWidth(borderWidth).stroke();

        doc.image('frontend/public/logo512.png');
        const signatureFontPath = 'frontend/fonts/GreatVibes-Regular.ttf';

        // Add content to the PDF with the custom font
        doc.font('Helvetica');
        doc.fontSize(24).text(`Palmyra Racing Association Member - ${new Date().getFullYear()}`);
        doc.fontSize(14).text(`${memberForCard.firstName} ${memberForCard.lastName}`);
        doc.fontSize(14).text(`Member id ${memberForCard.memberId}, Membership Id ${memberForCard.membershipId}`);
        doc.fontSize(14).text(`Primary member ${memberForCard.membershipAdmin}`);
        doc.fontSize(14).text(memberForCard.membershipType);
        doc.fontSize(14).text('');
        doc.font(signatureFontPath).fontSize(24).text(`${president?.firstName} ${president?.lastName}`);
        doc.font('Helvetica');
        doc.fontSize(12).text('President, Palmyra Racing Association');
        // Finalize the PDF
        doc.end();
    }
});

export default member;
