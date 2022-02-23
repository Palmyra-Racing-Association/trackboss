import { Member } from 'src/typedefs/member';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { memberList, mockGetMember, mockGetMemberList, mockInsertMember, mockPatchMember } from './mocks/member';

const TAG_ROOT = '/api/member';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /member/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetMemberList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(memberList.length);
        expect(members[0]).toEqual(memberList[0]);
        expect(members[1]).toEqual(memberList[1]);
        expect(members[2]).toEqual(memberList[2]);
        expect(members[3]).toEqual(memberList[3]);
    });

    const testFilterForRole = async (role: string, target: number): Promise<void> => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=${role}`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetMemberList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const members: Member[] = res.body;
        expect(members.length).toBe(1);
        expect(members[0]).toEqual(memberList[target]);
    };

    it('Correctly filters by role Admin', async () => {
        await testFilterForRole('admin', 0);
    });

    it('Correctly filters by role Membership Admin', async () => {
        await testFilterForRole('membershipAdmin', 1);
    });

    it('Correctly filters by role Member', async () => {
        await testFilterForRole('member', 2);
    });

    it('Correctly filters by role Paid Laborer', async () => {
        await testFilterForRole('paidLaborer', 3);
    });

    it('Returns 400 for invalid role', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?role=invalid`)
            .set('Authorization', 'Bearer validtoken');
        // the api should not query the database in this case, and thus the mock should not be called
        expect(mockGetMemberList).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('invalid role specified');
    });
});

describe('GET /member/:memberId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMemberList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const member: Member = res.body;
        expect(member).toEqual(memberList[2]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /member/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockGetMemberList).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMemberList).not.toHaveBeenCalled();
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
        expect(mockInsertMember).not.toHaveBeenCalled();
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
            });
        expect(mockInsertMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const member: Member = res.body;
        expect(member.memberId).toBe(memberList[memberList.length - 1].memberId);
        expect(member).toEqual(memberList[memberList.length - 1]);
    });
});

describe('PATCH /member/:memberId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockPatchMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockPatchMember).toHaveBeenCalled();
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
        expect(mockPatchMember).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
