import { Member } from 'src/typedefs/member';
import supertest from 'supertest';
import server from '../../server';
import { memberList, mockGetMemberList } from './mocks/member';

const TAG_ROOT = '/api/member';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented member endpoints are reachable', () => {
    it('POST /member/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /member/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

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
