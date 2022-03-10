import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import {
    membershipList,
    mockGetMembership,
    mockGetMembershipList,
    mockGetRegistration,
    mockInsertMembership,
    mockPatchMembership,
    mockRegisterMembership,
} from './mocks/membership';
import { mockGetMember } from './mocks/member';
import { Membership } from '../../typedefs/membership';

const TAG_ROOT = '/api/membership';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /membership/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetMembershipList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMembershipList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBe(membershipList.length);
        expect(memberships[0]).toEqual(membershipList[0]);
        expect(memberships[1]).toEqual(membershipList[1]);
        expect(memberships[2]).toEqual(membershipList[2]);
    });

    it('Correctly filters by active status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=active`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Active');
        });
    });

    it('Correctly filters by inactive status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=inactive`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Disabled');
        });
    });

    it('Correctly filters by pending status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=pending`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        memberships.forEach((ms: Membership) => {
            expect(ms.status === 'Pending');
        });
    });

    it('Correctly filters by incorrect status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?status=incorrect`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetMembershipList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberships: Membership[] = res.body;
        expect(memberships.length).toBe(0);
    });
});

describe('GET /membership/:membershipId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMembership).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct membership', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMembership).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const membership: Membership = res.body;
        expect(membership).toEqual(membershipList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMembership).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /membership/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockInsertMembership).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertMembership).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertMembership).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertMembership).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a membership', async () => {
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
        expect(mockInsertMembership).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMembership).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const membership: Membership = res.body;
        expect(membership.membershipId).toBe(membershipList[membershipList.length - 1].membershipId);
        expect(membership).toEqual(membershipList[membershipList.length - 1]);
    });
});

describe('POST /membership/register', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/register`);
        expect(res.status).toBe(500);
        expect(mockRegisterMembership).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/register`);
        expect(res.status).toBe(400);
        expect(mockRegisterMembership).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Successfully registers a membership', async () => {
        // it's a post, yes, but the mock doesn't need a body
        const res = await supertestServer.post(`${TAG_ROOT}/register`);
        expect(mockRegisterMembership).toHaveBeenCalled();
        expect(mockGetRegistration).toHaveBeenCalled();
        expect(res.status).toBe(201);
    });
});

describe('PATCH /membership/:membershipId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchMembership).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockPatchMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchMembership).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a membership', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ make: 'newMake' });
        expect(res.status).toBe(200);
        expect(res.body.membershipId).toBe(0);
        expect(res.body.make).toBe('newMake');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ make: 'newMake' });
        expect(res.status).toBe(403);
        expect(mockPatchMembership).not.toHaveBeenCalled();
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchMembership).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
