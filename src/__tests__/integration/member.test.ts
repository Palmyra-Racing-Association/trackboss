import supertest from 'supertest';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import server from '../../server';
import { destroyPool } from '../../database/pool';
import { Member } from '../../typedefs/member';

const TAG_ROOT = '/api/member';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('GET /member/list', () => {
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
        const members: Member[] = res.body;
        expect(members.length).toBe(100);
        // expect(members[0]).toEqual(memberList[0]);
        // expect(members[1]).toEqual(memberList[1]);
        // expect(members[2]).toEqual(memberList[2]);
        // expect(members[3]).toEqual(memberList[3]);
    });

    it('Correctly filters by role Admin', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=admin`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(13);
    });

    it('Correctly filters by role Membership Admin', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=membershipAdmin`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(47);
    });

    it('Correctly filters by role Member', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=member`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(21);
    });

    it('Correctly filters by role Paid Laborer', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=paidLaborer`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(19);
    });

    it('Returns 400 for invalid role', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=invalid`)
            .set('Authorization', 'Bearer validtoken');
        // the api should not query the database in this case, and thus the mock should not be called
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('invalid role specified');
    });
});

describe('GET /member/:memberId', () => {
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

    it('GETs the correct member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const member: Member = res.body;
        // expect(member).toEqual(memberList[2]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1046`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /member/new', () => {
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
                uuid: '54f',
                firstName: 'Newton',
                lastName: 'Member',
                phoneNumber: '999-999-5264',
                dateJoined: '2022-02-12',
                birthdate: '1984-06-14',
                occupation: 'Tester',
                email: 'newton@codetesters.com',
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('successfully inserts a member', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                uuid: '54f',
                firstName: 'Newton',
                lastName: 'Member',
                phoneNumber: '999-999-5264',
                dateJoined: '2022-02-12',
                birthdate: '1984-06-14',
                occupation: 'Tester',
                email: 'newton@codetesters.com',
                memberTypeId: 1,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const member: Member = res.body;
        expect(member.memberId).toBe(101);
        // expect(member).toEqual(memberList[memberList.length - 1]);
    });
});

describe('PATCH /member/:memberId', () => {
    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Successfully patches a member', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ email: 'chan@kungfu.org' });
        expect(res.status).toBe(200);
        expect(res.body.memberId).toBe(2);
        expect(res.body.email).toBe('chan@kungfu.org');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ email: 'chan@kungfu.org' });
        expect(res.status).toBe(403);
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/1074`)
            .set('Authorization', 'Bearer admin')
            .send({ email: 'chan@kungfu.org' });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
