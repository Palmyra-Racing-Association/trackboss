import _ from 'lodash';
import supertest from 'supertest';
import { mockInvalidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import server from '../../server';
import { destroyPool } from '../../database/pool';
import { Member } from '../../typedefs/member';
import { createVerifier } from '../../util/auth';

const TAG_ROOT = '/api/member';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

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
        // the registration test _sometimes_ runs before this, meaning an extra entry
        expect([103, 104]).toContain(members.length);
        expect(members[0].memberId).toBe(1);
        expect(members[0].membershipId).toBe(2);
        expect(members[0].firstName).toBe('Squeak');
        expect(members[0].lastName).toBe('Trainywhel');
        expect(members[0].memberType).toBe('Admin');
        expect(members[61].memberId).toBe(62);
        expect(members[61].firstName).toBe('Birdie');
        expect(members[61].lastName).toBe('Corradini');
        expect(members[61].memberType).toBe('Membership Admin');
    });

    it('Correctly filters by role Admin', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=admin`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(15);
        _.forEach(members, (member: Member) => expect(member.memberType).toBe('Admin'));
    });
    it('Correctly filters by role Membership Admin', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=membershipAdmin`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(48);
        _.forEach(members, (member: Member) => expect(member.memberType).toBe('Membership Admin'));
    });
    it('Correctly filters by role Member', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=member`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        // the registration test _sometimes_ runs before this, meaning an extra entry
        expect([21, 22]).toContain(members.length);
        _.forEach(members, (member: Member) => expect(member.memberType).toBe('Member'));
    });
    it('Correctly filters by role Paid Laborer', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=paidLaborer`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(19);
        _.forEach(members, (member: Member) => expect(member.memberType).toBe('Paid Laborer'));
    });
    it('Returns 400 for invalid role', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=invalid`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('invalid role specified');
    });
    it('Correctly filters by membership', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipId=4`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const list: Member[] = res.body;
        expect(list.length).toBe(5);
        expect(list[0].memberId).toBe(3);
        expect(list[1].memberId).toBe(41);
        expect(list[2].memberId).toBe(53);
        expect(list[3].memberId).toBe(91);
    });
    it('Correctly filters with both filter types', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipId=4&role=membershipAdmin`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const list: Member[] = res.body;
        expect(list.length).toBe(2);
        expect(list[0].memberId).toBe(41);
        expect(list[1].memberId).toBe(53);
    });
    it('Retruns 400 for invalid membership id', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipId=iamabadmembershipid`)
            .set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('invalid membership id');
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
        const res = await supertestServer.get(`${TAG_ROOT}/3`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const member: Member = res.body;
        expect(member.memberId).toBe(3);
        expect(member.membershipAdmin).toBe('Perry Spencley');
        expect(member.memberTypeId).toBe(3);
        expect(member.memberType).toBe('Member');
        expect(member.firstName).toBe('Grace');
        expect(member.lastName).toBe('Lovekin');
        expect(member.phoneNumber).toBe('955-144-3168');
        expect(member.occupation).toBe('Marketing Manager');
        expect(member.email).toBe('glovekin1@ameblo.jp');
        expect(member.birthdate).toBe('1954-08-20');
        expect(member.dateJoined).toBe('2016-07-03');
        expect(member.active).toBe(true);
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
        const newMember = {
            uuid: '54f',
            firstName: 'Newton',
            lastName: 'Member',
            phoneNumber: '999-999-5264',
            dateJoined: '2022-02-12',
            birthdate: '1984-06-14',
            occupation: 'Tester',
            email: 'newton@codetesters.com',
            memberTypeId: 1,
        };
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send(newMember);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const member: Member = res.body;
        // the registration test _sometimes_ runs before this, meaning an extra entry
        expect([104, 105]).toContain(member.memberId);
        expect(member.memberType).toBe('Admin');
        expect(member.uuid).toBe(newMember.uuid);
        expect(member.firstName).toBe(newMember.firstName);
        expect(member.lastName).toBe(newMember.lastName);
        expect(member.phoneNumber).toBe(newMember.phoneNumber);
        expect(member.dateJoined).toBe(newMember.dateJoined);
        expect(member.birthdate).toBe(newMember.birthdate);
        expect(member.occupation).toBe(newMember.occupation);
        expect(member.email).toBe(newMember.email);
    });
});

describe('PATCH /member/:memberId', () => {
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
