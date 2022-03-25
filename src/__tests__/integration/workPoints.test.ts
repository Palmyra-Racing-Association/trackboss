import supertest from 'supertest';
import { createVerifier } from '../../util/auth';
import server from '../../server';
import { mockInvalidToken, mockValidToken } from '../util/authMocks';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/workPoints';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /workPoints/byMember/:id', () => {
    it('Returns 400 for unparseable year', async () => {
        const memberId = 1;
        const year = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const memberId = 1;
        const res = await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const memberId = 1;
        const res =
            await supertestServer.get(`${TAG_ROOT}/byMember/${memberId}`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 for member not found', async () => {
        const memberId = 3000;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for unparseable memberID', async () => {
        const memberId = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns current-year work points for member', async () => {
        const memberId = 17;
        const expWorkPoints = { total: 3 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expWorkPoints);
    });

    it('Returns work points for member from specific year', async () => {
        const memberId = 1;
        const year = 2020;
        const expWorkPoints = { total: 3 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMember/${memberId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expWorkPoints);
    });
});

describe('GET /workPoints/byMembership/:id', () => {
    it('Returns 400 for unparseable year', async () => {
        const membershipId = 1;
        const year = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const membershipId = 1;
        const res = await supertestServer.get(`${TAG_ROOT}/byMembership/${membershipId}`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const membershipId = 1;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 for membership not found', async () => {
        const membershipId = 3000;
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 for unparseable membershipID', async () => {
        const membershipId = 'notANumber';
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns current-year work points for membership', async () => {
        const membershipId = 46;
        const expWorkPoints = { total: 6 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expWorkPoints);
    });

    it('Returns work points for membership from specific year', async () => {
        const membershipId = 3;
        const year = 2020;
        const expWorkPoints = { total: 11 };
        const res = await supertestServer
            .get(`${TAG_ROOT}/byMembership/${membershipId}`)
            .query({ year })
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body).toEqual(expWorkPoints);
    });
});
