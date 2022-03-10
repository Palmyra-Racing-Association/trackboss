import supertest from 'supertest';
import server from '../../server';
import { BoardMemberType } from '../../typedefs/boardMemberType';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import {
    boardMemberTypeList,
    mockDeleteBoardMemberType,
    mockGetBoardMemberType,
    mockGetBoardMemberTypeList,
    mockInsertBoardMemberType,
    mockPatchBoardMemberType,
} from './mocks/boardMemberType';
import { mockGetMember } from './mocks/member';

const TAG_ROOT = '/api/boardMemberType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /boardMemberType/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetBoardMemberTypeList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetBoardMemberTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBoardMemberTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberTypeList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const boardMemberTypes: BoardMemberType[] = res.body;
        expect(boardMemberTypes.length).toBe(boardMemberTypeList.length);
        expect(boardMemberTypes[0]).toEqual(boardMemberTypeList[0]);
        expect(boardMemberTypes[1]).toEqual(boardMemberTypeList[1]);
    });
});

describe('GET /boardMemberType/:boardMemberTypeId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct type', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const boardMemberType: BoardMemberType = res.body;
        expect(boardMemberType).toEqual(boardMemberTypeList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad parameter', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/imbadtothebone`).set('Authorization', 'Bearer validtoken');
        expect(mockGetBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /boardMemberType/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertBoardMemberType).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertBoardMemberType).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertBoardMemberType).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertBoardMemberType).not.toHaveBeenCalled();
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
        expect(mockInsertBoardMemberType).not.toHaveBeenCalled();
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
        expect(mockInsertBoardMemberType).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const boardMemberType: BoardMemberType = res.body;
        expect(boardMemberType.boardTypeId).toBe(boardMemberTypeList[boardMemberTypeList.length - 1].boardTypeId);
        expect(boardMemberType).toEqual(boardMemberTypeList[boardMemberTypeList.length - 1]);
    });
});

describe('PATCH /boardMemberType/:boardMemberTypeId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockPatchBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ title: 'the guy in charge' });
        expect(res.status).toBe(200);
        expect(res.body.boardTypeId).toBe(0);
        expect(res.body.title).toBe('the guy in charge');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ make: 'newMake' });
        expect(res.status).toBe(403);
        expect(mockPatchBoardMemberType).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('DELETE /boardMemberType/:boardMemberTypeId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`);
        expect(mockDeleteBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes a type', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.boardMemberTypeId).toBe(0);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
        expect(mockDeleteBoardMemberType).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockDeleteBoardMemberType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
