import supertest from 'supertest';
import { createVerifier } from '../../util/auth';
import server from '../../server';
import {
    boardMemberList,
    mockDeleteBoardMember,
    mockGetBoardMember,
    mockGetBoardMemberList,
    mockInsertBoardMember,
    mockPatchBoardMember,
} from './mocks/boardMember';
import { mockGetMember } from './mocks/member';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { BoardMember } from '../../typedefs/boardMember';

const TAG_ROOT = '/api/boardMember';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /boardMember/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetBoardMemberList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetBoardMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBoardMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const boardMembers: BoardMember[] = res.body;
        expect(boardMembers.length).toBe(boardMemberList.length);
        expect(boardMembers[0]).toEqual(boardMemberList[0]);
        expect(boardMembers[1]).toEqual(boardMemberList[1]);
    });

    it('Correctly filters by year', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?year=2021`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const boardMembers: BoardMember[] = res.body;
        expect(boardMembers.length).toBe(1);
        expect(boardMembers[0]).toEqual(boardMemberList[2]);
    });
});

describe('GET /boardMember/:boardMemberId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct board member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const boardMember: BoardMember = res.body;
        expect(boardMember).toEqual(boardMemberList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad parameter', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/imbadtothebone`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
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

describe('PATCH /boardMember/:boardMemberId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockPatchBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a board member', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ year: '2023' });
        expect(res.status).toBe(200);
        expect(res.body.boardId).toBe(0);
        expect(res.body.year).toBe('2023');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ make: 'newMake' });
        expect(res.status).toBe(403);
        expect(mockPatchBoardMember).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('DELETE /boardMember/:boardMemberId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`);
        expect(mockDeleteBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMember).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes a board member', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.boardMemberId).toBe(0);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
        expect(mockDeleteBoardMember).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
