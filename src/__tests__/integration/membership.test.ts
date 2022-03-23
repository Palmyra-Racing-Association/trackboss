import _ from 'lodash';
import { format } from 'date-fns';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import {
    mockInvalidToken,
    mockValidToken,
    mockVerifyAdmin,
    mockVerifyLaborer,
    mockVerifyMember,
} from '../util/authMocks';
import { mockGetMember } from '../api/mocks/member';
import { Membership, Registration } from '../../typedefs/membership';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/membership';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /membership/list', () => {
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

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBe(52);
    });

    it('Correctly filters by active status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=active`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBeGreaterThan(0);
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Active').toBeTruthy();
        });
    });

    it('Correctly filters by inactive status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=inactive`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBeGreaterThan(0);
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Disabled').toBeTruthy();
        });
    });

    it('Correctly filters by pending status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=pending`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBeGreaterThan(0);
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Pending').toBeTruthy();
        });
    });

    it('Correctly filters by incorrect status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=incorrect`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBe(0);
    });
});

describe('GET /membership/:membershipId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct membership', async () => {
        const expMembership = {
            membershipId: 1,
            membershipAdmin: 'Patin Lelliott',
            status: 'Active',
            curYearRenewed: false,
            renewalSent: false,
            yearJoined: 2009,
            address: '88811 Moulton Pass',
            city: 'Flushing',
            state: 'NY',
            zip: '48463',
            lastModifiedDate: null,
            lastModifiedBy: null,
        };
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const membership: Membership = res.body;
        expect(_.isEqual(membership, expMembership)).toBeTruthy();
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /membership/new', () => {
    it('Returns 400 for no input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for user input error', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({ membershipAdminId: 9999 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a membership', async () => {
        const today = format(new Date(), 'yyyy-MM-dd');
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                yearJoined: 2022,
                address: 'address',
                city: 'city',
                state: 'state',
                zip: 'zip',
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const membership: Membership = res.body;
        // would be 53, but the bad input test above makes the db skip 53
        expect(membership.membershipId).toBe(54);
        expect(membership.lastModifiedDate).toBe(today);
    });
});

describe('POST /membership/register', () => {
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/register`);
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Successfully registers a membership', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/register`)
            .send({
                memberTypeId: 3,
                firstName: 'Pewlett',
                lastName: 'Hackard',
                phoneNumber: '650-857-1501',
                occupation: 'Printer Bug Writer',
                email: 'printerbreaker@ph.com',
                birthdate: '1970-01-01',
                address: '1501 Page Mill Road',
                city: 'Palo Alto',
                state: 'CA',
                zip: '94304',
            });
        expect(res.status).toBe(201);
        const registration: Registration = res.body;
        expect(registration.memberType).toBe('Member');
        // check a field from the member entry
        expect(registration.firstName).toBe('Pewlett');
        // check a field from the membership entry
        expect(registration.address).toBe('1501 Page Mill Road');
    });
});

describe('PATCH /membership/:membershipId', () => {
    it('Returns 400 for no input', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/10`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for user input error', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/10`)
            .set('Authorization', 'Bearer admin')
            .send({ membershipAdminId: 9999 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/10`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/10`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/10`)
            .set('Authorization', 'Bearer laborer')
            .send({ status: 'Disabled' });
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/9999`)
            .set('Authorization', 'Bearer admin')
            .send({ status: 'Disabled' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a membership', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/10`)
            .set('Authorization', 'Bearer admin')
            .send({ status: 'Disabled' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.membershipId).toBe(10);
        expect(res.body.status).toBe('Disabled');
    });
});
