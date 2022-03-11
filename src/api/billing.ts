import { Request, Response, Router } from 'express';
import _ from 'lodash';
// import { format } from 'date-fns';
import { getBaseDues, getMembershipList } from 'src/database/membership';
import { getWorkPointsByMembership } from 'src/database/workPoints';
import logger from 'src/logger';
import { generateBill, getBillList, getWorkPointThreshold, markBillPaid } from '../database/billing';
import {
    Bill,
    GetBillListResponse,
    GetMembershipBillListResponse,
    GetWorkPointThresholdResponse,
    PostCalculateBillsResponse,
    PostPayBillResponse,
} from '../typedefs/bill';
import { checkHeader, verify } from '../util/auth';

//
// TODO: Emails are not sent for generated bills (line 206)
// (also uncomment the import on line 3)
//
// TODO: No fee calculated for bills (line 190)
//

const billing = Router();

billing.get('/yearlyWorkPointThreshold', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetWorkPointThresholdResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token);
            // If the year is undefined or NaN, just default to this year
            const year = Number(req.query.year) || new Date().getFullYear();
            response = await getWorkPointThreshold(year);
            res.status(200);
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

billing.get('/list', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetBillListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const { paymentStatus, year } = req.query;
            const billingList: Bill[] = await getBillList({
                paymentStatus: paymentStatus as string,
                year: Number(year) || undefined, // if NaN, just ignore
            });
            res.status(200);
            response = billingList;
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

billing.get('/:membershipID', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: GetMembershipBillListResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Membership Admin');
            const membershipId = Number(req.params.membershipID);
            if (Number.isNaN(membershipId)) {
                throw new Error('not found');
            }
            response = await getBillList({ membershipId });
            res.status(200);
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
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

billing.post('/new', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostPayBillResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Membership Admin');
            const membershipId = Number(req.params.membershipID);
            if (Number.isNaN(membershipId)) {
                throw new Error('not found');
            }
            await markBillPaid(membershipId);
            response = {};
            res.status(200);
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
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

billing.post('/', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    let response: PostCalculateBillsResponse;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        response = { reason: headerCheck.reason };
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
            const curYear = new Date().getFullYear();
            const membershipList = await getMembershipList('active');
            const { threshold } = await getWorkPointThreshold(curYear);
            // to protect against generating duplicate bills
            const preGeneratedBills = await getBillList({ year: curYear });

            // generate new bills for each active membership
            membershipList.forEach(async (membership) => {
                // only generate a bill if one hasn't already been generated
                if (typeof _.find(
                    preGeneratedBills,
                    (bill) => bill.membershipAdmin === membership.membershipAdmin,
                ) === 'undefined') {
                    try {
                        const baseDues = await getBaseDues(membership.membershipId);
                        const earned = (await getWorkPointsByMembership(membership.membershipId, curYear)).total;
                        const owed = (1 - earned / threshold) * baseDues;
                        await generateBill({
                            amount: owed,
                            amountWithFee: owed, // TODO: what's the fee?
                            membershipId: membership.membershipId,
                        });
                    } catch (e) {
                        // generate more bills even if this one failed
                        logger.error(`Failed to generate bill for membership with ID ${membership.membershipId}: ${e}`);
                    }
                }
            });

            // all bills have been generated, so now email all of them
            const generatedBills = await getBillList({ year: curYear });
            generatedBills.forEach(async (bill) => {
                // prevent sending duplicate emails for pre-generated bills
                if (typeof bill.emailedBill === 'undefined') {
                    try {
                        //
                        // TODO: send the email
                        //
                        // // (gonna need to import this fn from '../database/billing')
                        // await markBillEmailed(bill.billId);
                        // // update our local copy of the bill
                        // bill.emailedBill = format(new Date(), 'yyyy-MM-dd');
                        throw new Error('sending emails is unimplemented!');
                    } catch (e) {
                        // send more emails even if this one failed
                        logger.error(`Failed to email bill ${bill.billId} to ${bill.membershipAdminEmail}: ${e}`);
                    }
                }
            });

            res.status(201);
            response = generatedBills;
        } catch (e: any) {
            if (e.message === 'Authorization Failed') {
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

export default billing;
