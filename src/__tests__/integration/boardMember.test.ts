import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockVerifyMember, mockVerifyAdmin } from '../util/authMocks';
import { BoardMember } from '../../typedefs/boardMember';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/boardMember';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('GET /boardMember/list', () => {
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
        const boardMembers: BoardMember[] = res.body;
        expect(boardMembers.length).toBe(13);
        _.forEach(boardMembers, (boardMember: BoardMember, index) => {
            expect(boardMember.boardId).toBe(index + 1);
        });
        expect(boardMembers[0].boardId).toBe(1);
        expect(boardMembers[0].year).toBe(2022);
        expect(boardMembers[0].memberId).toBe(1);
        expect(boardMembers[0].title).toBe('President');
    });
});

describe('POST /boardMember/new', () => {
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

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                boardMemberTitleId: 1,
                year: 2023,
                memberId: 1,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a board Member', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                boardMemberTitleId: 1,
                year: 2023,
                memberId: 1,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const boardMember: BoardMember = res.body;
        expect(boardMember.year).toBe(2023);
        expect(boardMember.memberId).toBe(1);
        expect(boardMember.title).toBe('President');
    });
});

describe('GET /boardMember/:boardMemberId', () => {
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

    it('GETs the correct board member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const boardMember: BoardMember = res.body;
        expect(boardMember.boardId).toBe(1);
        expect(boardMember.title).toBe('President');
        expect(boardMember.memberId).toBe(1);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/170`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /boardMember/:boardMemberId', () => {
    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/list`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Successfully patches a board Member type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 20 });
        expect(res.status).toBe(200);
        expect(res.body.memberId).toBe(20);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ memberId: 20 });
        expect(res.status).toBe(403);
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/170`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 20 });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 400 for FK violation', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/4`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 1043 });
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});
describe('DELETE /boardMember/:boardMemberId', () => {
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
    it('Successfully deletes a board member', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/14`)
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
