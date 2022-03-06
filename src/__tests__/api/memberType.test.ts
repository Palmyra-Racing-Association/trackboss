import { MemberType } from 'src/typedefs/memberType';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin } from '../util/authMocks';
import { memberTypeList, mockGetMemberType, mockGetMemberTypeList, mockPatchMemberType } from './mocks/memberType';

const TAG_ROOT = '/api/memberType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /memberType/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetMemberTypeList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetMemberTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMemberTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberTypeList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberTypes: MemberType[] = res.body;
        expect(memberTypes.length).toBe(memberTypeList.length);
        expect(memberTypes[0]).toEqual(memberTypeList[0]);
        expect(memberTypes[1]).toEqual(memberTypeList[1]);
    });
});

describe('GET /memberType/:memebrTypeId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMemberType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct member type', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const memberType: MemberType = res.body;
        expect(memberType).toEqual(memberTypeList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /memberType/:memberTypeId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        // expect(mockPatchMemberType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        // expect(mockPatchMemberType).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Successfully patches a member type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ baseDuesAmount: 100 });
        // expect(mockPatchMemberType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.memberTypeId).toBe(2);
        expect(res.body.baseDuesAmount).toBe(100);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ baseDuesAmount: 100 });
        expect(res.status).toBe(403);
        expect(mockPatchMemberType).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchMemberType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
