import 'dotenv/config';
import _ from 'lodash';
import supertest from 'supertest';
import { createVerifier } from '../../util/auth';
import server from '../../server';
import { mockInvalidToken, mockValidToken } from '../util/authMocks';
import { mockGetWorkPointsByMember, mockGetWorkPointsByMembership } from './mocks/workPoints';

const TAG_ROOT = '/api/workPoints';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /workPoints/byMember/:id', () => {
    it('returns current-year work points for member', async () => {
        const memberId = 1;
        const expWorkPoints = { total: 1000 };
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(_.isEqual(res.body, expWorkPoints));
    });

    it('returns work points for member from specific year', async () => {
        const memberId = 1;
        const year = 2020;
        const expWorkPoints = { total: 0 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(_.isEqual(res.body, expWorkPoints));
    });

    it('returns 400 for unparseable year', async () => {
        const memberId = 1;
        const year = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 401 for no token', async () => {
        const memberId = 1;
        const res = await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`);
        expect(mockGetWorkPointsByMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('returns 401 for invalid token', async () => {
        const memberId = 1;
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('returns 404 for member not found', async () => {
        const memberId = 3000;
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 404 for unparseable memberID', async () => {
        const memberId = 'notANumber';
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 500 for internal server error', async () => {
        const memberId = -100;
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });
});

describe('GET /workPoints/byMembership/:id', () => {
    it('returns current-year work points for membership', async () => {
        const membershipId = 1;
        const expWorkPoints = { total: 1000 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(_.isEqual(res.body, expWorkPoints));
    });

    it('returns work points for membership from specific year', async () => {
        const membershipId = 1;
        const year = 2020;
        const expWorkPoints = { total: 0 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(_.isEqual(res.body, expWorkPoints));
    });

    it('returns 400 for unparseable year', async () => {
        const membershipId = 1;
        const year = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 401 for no token', async () => {
        const membershipId = 1;
        const res = await supertestServer.get(`${TAG_ROOT}/byMembership/${membershipId}`);
        expect(mockGetWorkPointsByMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('returns 401 for invalid token', async () => {
        const membershipId = 1;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('returns 404 for membership not found', async () => {
        const membershipId = 3000;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 404 for unparseable membershipID', async () => {
        const membershipId = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 500 for internal server error', async () => {
        const membershipId = -100;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        // expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });
});
