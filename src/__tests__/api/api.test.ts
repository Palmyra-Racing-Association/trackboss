import supertest from 'supertest';
import { mockValidToken } from '../util/authMocks';
import server from '../../server';
import { mockQuery } from '../database/server/mockQuery';

const TAG_ROOT = '/api';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
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
    it('Returns returns a valid member with a valid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/me`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockQuery).toHaveBeenCalled();
        expect(res.body.uuid).toBe('thisIsAUuid');
        expect(res.body.memberId).toBe(18);
    });
    // 404 and 500 error cases from the database are not covered here
    // but use identical syntax to all other API calls
    // Additionally, 404 should never happen, but the mocks exist should we want to test
});
