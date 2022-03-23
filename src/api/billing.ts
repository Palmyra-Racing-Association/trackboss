import { Request, Response, Router } from 'express';
import _ from 'lodash';
// import { format } from 'date-fns';
import { getMembershipList } from '../database/membership';
import { getBillList, getWorkPointThreshold, markBillPaid } from '../database/billing';
import {
    Bill,
    GetBillListResponse,
    GetMembershipBillListResponse,
    GetWorkPointThresholdResponse,
    PostCalculateBillsResponse,
    PostPayBillResponse,
} from '../typedefs/bill';
import { checkHeader, verify } from '../util/auth';
import { emailBills, generateNewBills } from '../util/billing';

//
// TODO: Emails are not sent for generated bills (see emailBills helper function in util)
// (also uncomment the import on line 3)
//
// TODO: No fee calculated for bills (see generateNewBills helper function in util)
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

            const results = await getBillList({ membershipId });
            if (_.isEmpty(results)) {
                throw new Error('not found');
            }

            response = results;
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

billing.post('/:membershipID', async (req: Request, res: Response) => {
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

            let generatedBills = await generateNewBills(membershipList, preGeneratedBills, threshold, curYear);
            generatedBills = await emailBills(generatedBills);

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
