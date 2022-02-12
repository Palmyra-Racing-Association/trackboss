import { Member } from 'src/typedefs/member';
import supertest from 'supertest';
import server from '../../server';
import { memberList, mockGetMember, mockGetMemberList, mockInsertMember } from './mocks/member';

const TAG_ROOT = '/api/member';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented member endpoints are reachable', () => {
    it('PATCH /member/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});

describe('GET /member/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetMemberList).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
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
        const res = await supertestServer.get(`${TAG_ROOT}/list?role=${role}`);
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
        const res = await supertestServer.get(`${TAG_ROOT}/list?role=invalid`);
        // the api should not query the database in this case, and thus the mock should not be called
        expect(mockGetMemberList).toHaveBeenCalledTimes(0);
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('invalid role specified');
    });
});

describe('GET /member/:memberId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/3`);
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('GETs the correct member', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const member: Member = res.body;
        expect(member).toEqual(memberList[2]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`);
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /member/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(mockInsertMember).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('successfully inserts a member', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
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
        expect(res.status).toBe(201);
        const member: Member = res.body;
        expect(member.memberId).toBe(memberList[memberList.length - 1].memberId);
        expect(member).toEqual(memberList[memberList.length - 1]);
    });
});
