import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import {
    billList,
    mockGetBillList,
    mockGetThreshold,
    mockMarkBillPaid,
} from './mocks/billing';
import {
    mockInvalidToken,
    mockValidToken,
    mockVerifyAdmin,
    mockVerifyMember,
    mockVerifyMembershipAdmin,
} from '../util/authMocks';
import { Bill, WorkPointThreshold } from '../../typedefs/bill';
import { mockGetMember } from './mocks/member';
import * as billingUtil from '../../util/billing';
import { mockGetMembershipList } from './mocks/membership';

const TAG_ROOT = '/api/billing';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /billing/yearlyWorkPointThreshold', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetThreshold).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/yearlyWorkPointThreshold`);
        expect(mockGetThreshold).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold`)
            .set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetThreshold).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the default threshold without query', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetThreshold).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(new Date().getFullYear());
    });

    it('Gets the default threshold with NaN query', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold?year=bwahahaFearMeForIAmString`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetThreshold).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(new Date().getFullYear());
    });

    it('Gets the correct threshold with query', async () => {
        const year = 1976;
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold?year=${year}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetThreshold).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(year);
    });
});

describe('GET /billing/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=ise`)
            .set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetBillList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBillList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        expect(_.isEqual(result, billList)).toBeTruthy();
    });

    it('Correctly filters by paid status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=paid`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        result.forEach((b: Bill) => {
            expect(b.curYearPaid).toBeTruthy();
        });
    });

    it('Correctly filters by outstanding status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=outstanding`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        result.forEach((b: Bill) => {
            expect(b.curYearPaid).toBeFalsy();
        });
    });

    it('Correctly filters by incorrect status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=incorrect`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        expect(_.isEqual(result, billList)).toBeTruthy();
    });

    it('Correctly filters by year', async () => {
        const year = 2022;
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?year=${year}`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        result.forEach((b: Bill) => {
            expect(b.year).toBe(year);
        });
    });

    it('Correctly ignores NaN year filter', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?year=incorrect`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        expect(_.isEqual(result, billList)).toBeTruthy();
    });
});

describe('GET /billing/:membershipID', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/500`)
            .set('Authorization', 'Bearer membershipAdmin');
        expect(res.status).toBe(500);
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`);
        expect(mockGetBillList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBillList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyMembershipAdmin).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Returns 404 for membershipId not found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for NaN membershipId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/Jimbus%20Gimbus`)
            .set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Gets the list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const result: Bill[] = res.body;
        result.forEach((b: Bill) => {
            expect(b.membershipAdmin).toBe('Jimbus Gimbus');
        });
    });
});

describe('POST /billing/:membershipID', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockMarkBillPaid).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`);
        expect(res.status).toBe(401);
        expect(mockMarkBillPaid).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockMarkBillPaid).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Returns 404 for membershipID not found', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockMarkBillPaid).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for NaN membershipID', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/Jimbus%20Gimbus`)
            .set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockMarkBillPaid).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Marks a bill as paid', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockMarkBillPaid).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });
});

describe('POST /billing/', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`);
        expect(res.status).toBe(401);
        expect(mockMarkBillPaid).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockMarkBillPaid).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Generates all-new bills', async () => {
        const expResult = [{
            billId: 0,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Jimbus Gimbus',
            membershipAdminEmail: 'em@il.com',
            emailedBill: '2022-03-21',
            curYearPaid: true,
        }];

        const mockGenerateNewBills = jest
            .spyOn(billingUtil, 'generateNewBills')
            .mockImplementation(async (): Promise<Bill[]> => Promise.resolve([{
                billId: 0,
                generatedDate: '2022-03-21',
                year: 2022,
                amount: 100,
                amountWithFee: 101,
                membershipAdmin: 'Jimbus Gimbus',
                membershipAdminEmail: 'em@il.com',
                emailedBill: undefined,
                curYearPaid: true,
            }]));
        const mockEmailBills = jest
            .spyOn(billingUtil, 'emailBills')
            .mockImplementation(async (generatedBills: Bill[]): Promise<Bill[]> => {
                generatedBills.forEach((bill) => { bill.emailedBill = '2022-03-21'; });
                return Promise.resolve(generatedBills);
            });

        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(201);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(mockGetThreshold).toHaveBeenCalled();
        expect(mockGetBillList).toHaveBeenCalled();
        expect(mockGenerateNewBills).toHaveBeenCalled();
        expect(mockEmailBills).toHaveBeenCalled();
        const result: Bill[] = res.body;
        expect(_.isEqual(result, expResult)).toBeTruthy();
    });
});
