import supertest from 'supertest';
import { createVerifier } from '../../util/auth';
import server from '../../server';
import { boardMemberList, mockInsertBoardMember } from './mocks/boardMember';
import { mockGetMember } from './mocks/member';
import { mockInvalidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { BoardMember } from '../../typedefs/boardMember';

const TAG_ROOT = '/api/boardMember';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented member endpoints are reachable', () => {
    it('GET /boardMember/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /boardMember/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('DELETE /boardMember/:id is reachable', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});

describe('POST /boardMember/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertBoardMember).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertBoardMember).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertBoardMember).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertBoardMember).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                boardId: 0,
                title: 'President',
                year: 2021,
                memberId: 0,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockInsertBoardMember).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('successfully inserts a member', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                title: 0,
                year: 2021,
                memberId: 0,
            });
        expect(mockInsertBoardMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const boardMember: BoardMember = res.body;
        expect(boardMember.boardId).toBe(boardMemberList[boardMemberList.length - 1].boardId);
        expect(boardMember).toEqual(boardMemberList[boardMemberList.length - 1]);
    });
});
