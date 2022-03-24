import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import {
    mockInvalidToken,
    mockValidToken,
    mockVerifyAdmin,
    mockVerifyMember,
    mockVerifyMembershipAdmin,
} from '../util/authMocks';
import { Bill, WorkPointThreshold } from '../../typedefs/bill';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/billing';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /billing/yearlyWorkPointThreshold', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/yearlyWorkPointThreshold`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold`)
            .set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the default threshold without query', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(new Date().getFullYear());
    });

    it('Gets the default threshold with NaN query', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold?year=bwahahaFearMeForIAmString`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(new Date().getFullYear());
    });

    it('Gets the correct threshold with query', async () => {
        const year = 2020;
        const res = await supertestServer
            .get(`${TAG_ROOT}/yearlyWorkPointThreshold?year=${year}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const wpt: WorkPointThreshold = res.body;
        expect(wpt.year).toEqual(year);
    });
});

describe('GET /billing/list', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('forbidden');
        expect(res.status).toBe(403);
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBe(117);
    });

    it('Correctly filters by paid status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=paid`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBeGreaterThan(0);
        results.forEach((b: Bill) => {
            expect(b.curYearPaid).toBe(true);
        });
    });

    it('Correctly filters by outstanding status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=outstanding`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBeGreaterThan(0);
        results.forEach((b: Bill) => {
            expect(b.curYearPaid).toBe(false);
        });
    });

    it('Correctly filters by incorrect status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?paymentStatus=incorrect`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBe(117);
    });

    it('Correctly filters by year', async () => {
        const year = 2022;
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?year=${year}`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBeGreaterThan(0);
        results.forEach((b: Bill) => {
            expect(b.year).toBe(year);
        });
    });

    it('Correctly ignores NaN year filter', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?year=incorrect`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBe(117);
    });
});

describe('GET /billing/:membershipID', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/0`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyMembershipAdmin).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Returns 404 for membershipId not found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for NaN membershipId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/Jimbus%20Gimbus`)
            .set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Gets the list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const results: Bill[] = res.body;
        expect(results.length).toBeGreaterThan(0);
        results.forEach((b: Bill) => {
            expect(b.membershipAdmin).toBe('Patin Lelliott');
        });
    });
});

describe('POST /billing/:membershipID', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
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
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for NaN membershipID', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/Jimbus%20Gimbus`)
            .set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Marks a bill as paid', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/95`).set('Authorization', 'Bearer membershipAdmin');
        expect(mockVerifyMembershipAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
    });
});

describe('POST /billing/', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
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
        const preRes = await supertestServer
            .get(`${TAG_ROOT}/list?year=${new Date().getFullYear()}`)
            .set('Authorization', 'Bearer admin');
        const preGeneratedBills: Bill[] = preRes.body;
        expect(preGeneratedBills.length).toBeGreaterThan(0);

        const res = await supertestServer.post(`${TAG_ROOT}/`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(201);
        expect(mockVerifyAdmin).toHaveBeenCalledTimes(2);
        const result: Bill[] = res.body;
        expect(result.length).toBeGreaterThan(0);
        expect(_.intersectionWith(result, preGeneratedBills, _.isEqual).length).toBe(0);
    });
});
