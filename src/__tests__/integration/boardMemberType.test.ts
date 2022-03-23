import supertest from 'supertest';
import { mockInvalidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import server from '../../server';
import { destroyPool } from '../../database/pool';
import { BoardMemberType } from '../../typedefs/boardMemberType';
import { createVerifier } from '../../util/auth';

const TAG_ROOT = '/api/boardMemberType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('GET /boardMemberType/list', () => {
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
        expect(res.status).toBe(200);
        const boardMemberTypes: BoardMemberType[] = res.body;
        expect(boardMemberTypes.length).toBe(10);
        expect(boardMemberTypes[0].boardTypeId).toBe(1);
        expect(boardMemberTypes[0].title).toBe('President');
        expect(boardMemberTypes[8].boardTypeId).toBe(9);
        expect(boardMemberTypes[8].title).toBe('Public Relations');
    });
});

describe('GET /boardMemberType/:boardMemberType', () => {
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
    it('GETs the correct boardMemberType', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/3`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const boardMemberType: BoardMemberType = res.body;
        expect(boardMemberType.boardTypeId).toBe(3);
        expect(boardMemberType.title).toBe('Treasurer');
    });
    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1046`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /boardMemberType/new', () => {
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
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
    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                title: 'Scientist',
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });
    it('successfully inserts a boardMemberType', async () => {
        const newType = {
            title: 'Scientist',
        };
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send(newType);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const boardMemberType: BoardMemberType = res.body;
        expect(boardMemberType.boardTypeId).toBe(11);
        expect(boardMemberType.title).toBe(newType.title);
    });
});

describe('PATCH /boardMemberType/:boardMemberTypeId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });
    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });
    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
    it('Successfully patches a member', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ title: 'VP' });
        expect(res.status).toBe(200);
        expect(res.body.boardTypeId).toBe(2);
        expect(res.body.title).toBe('VP');
    });
    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ title: 'VP' });
        expect(res.status).toBe(403);
    });
    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/1074`)
            .set('Authorization', 'Bearer admin')
            .send({ title: 'VP' });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
describe('DELETE /boardMemberType/:boardMemberTypeId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/5`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });
    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/5`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });
    // it('Returns 400 on user input error', async () => {
    //     const res = await supertestServer.delete(`${TAG_ROOT}/notanid`).set('Authorization', 'Bearer admin');
    //     expect(res.status).toBe(400);
    //     expect(res.body.reason).toBe('bad request');
    // });
    it('Successfully deletes a bmt', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/10`)
            .set('Authorization', 'Bearer admin');
        expect(res.status).toBe(200);
    });
    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
    });
    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/1074`)
            .set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
