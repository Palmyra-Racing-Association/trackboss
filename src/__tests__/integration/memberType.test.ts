import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken } from '../util/authMocks';
import { MemberType } from '../../typedefs/memberType';

const TAG_ROOT = '/api/memberType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /memberType/list', () => {
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
        const memberTypes: MemberType[] = res.body;
        expect(memberTypes.length).toBe(4);
        expect(memberTypes[0].memberTypeId).toBe(1);
        expect(memberTypes[0].type).toBe('Admin');
        expect(memberTypes[0].baseDuesAmt).toBe(100);
        expect(memberTypes[1].memberTypeId).toBe(2);
        expect(memberTypes[1].type).toBe('Membership Admin');
        expect(memberTypes[1].baseDuesAmt).toBe(100);
        expect(memberTypes[2].memberTypeId).toBe(3);
        expect(memberTypes[2].type).toBe('Member');
        expect(memberTypes[2].baseDuesAmt).toBe(0);
        expect(memberTypes[3].memberTypeId).toBe(4);
        expect(memberTypes[3].type).toBe('Paid Laborer');
        expect(memberTypes[3].baseDuesAmt).toBe(0);
    });
});

describe('GET /memberType/:memberTypeId', () => {
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

    it('GETs the correct member type', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const memberType: MemberType = res.body;
        expect(memberType.memberTypeId).toBe(1);
        expect(memberType.type).toBe('Admin');
        expect(memberType.baseDuesAmt).toBe(100);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /memberType/:memberTypeId', () => {
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

    it('Successfully patches a member type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/3`)
            .set('Authorization', 'Bearer admin')
            .send({ baseDuesAmt: 100 });
        expect(res.status).toBe(200);
        expect(res.body.memberTypeId).toBe(3);
        expect(res.body.baseDuesAmt).toBe(100);
        expect(res.body.type).toBe('Member');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ baseDuesAmount: 100 });
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/17`)
            .set('Authorization', 'Bearer admin')
            .send({ baseDuesAmt: 100 });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
