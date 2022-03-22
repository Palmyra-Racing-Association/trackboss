import supertest from 'supertest';
import { mockVerifyAdmin } from '../util/authMocks';
import server from '../../server';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('GET /me', () => {
    // these two test cases are sufficient to establish that the underlying method is
    // being called and the reason is being passed correctly
    it('Returns 401 and correct reason with no grant', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });
    // this test also establishes that the header is being read correctly
    it('Returns 401 and correct reason with bad structure', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`).set('Authorization', 'badtoken');
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Authorization grant in header has invalid structure');
    });
    it('Returns 401 and correct reason with invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Invalid token');
    });
    it('Returns 404 and correct reason with nonexistent member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`).set('Authorization', 'Bearer nonexistent');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
    it('Returns returns a valid member with a valid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(200);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.body.uuid).toBe('7b');
        expect(res.body.memberId).toBe(95);
    });
    // 404 and 500 error cases from the database are not covered here
    // but use identical syntax to all other API calls
    // Additionally, 404 should never happen, but the mocks exist should we want to test
});
