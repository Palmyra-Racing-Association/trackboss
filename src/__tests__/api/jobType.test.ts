import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { jobTypeList, mockGetJobType, mockGetJobTypeList, mockInsertJobType, mockPatchJobType } from './mocks/jobType';
import { mockGetMember } from './mocks/member';
import { JobType } from '../../typedefs/jobType';

const TAG_ROOT = '/api/jobType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('POST /jobType/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertJobType).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertJobType).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertJobType).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertJobType).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                title: 'new job type',
                reserved: true,
                online: true,
                mealTicket: true,
                modifiedBy: 42,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockInsertJobType).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a jobType', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                title: 'new job type',
                reserved: true,
                online: true,
                mealTicket: true,
                modifiedBy: 42,
            });
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockInsertJobType).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const jobType: JobType = res.body;
        expect(jobType.jobTypeId).toBe(jobTypeList[jobTypeList.length - 1].jobTypeId);
        expect(jobType).toEqual(jobTypeList[jobTypeList.length - 1]);
    });
});

describe('GET /jobType/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetJobTypeList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetJobTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetJobTypeList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJobTypeList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobTypes: JobType[] = res.body;
        expect(jobTypes.length).toBe(jobTypeList.length);
        expect(jobTypes[0]).toEqual(jobTypeList[0]);
        expect(jobTypes[1]).toEqual(jobTypeList[1]);
    });
});

describe('GET /jobType/:jobTypeId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJobType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetJobType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetJobType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the correct job type', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJobType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobType: JobType = res.body;
        expect(jobType).toEqual(jobTypeList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJobType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /jobType/:jobTypeId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockPatchJobType).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockPatchJobType).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/list`);
        expect(mockPatchJobType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchJobType).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Successfully patches a job type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ pointValue: 100 });
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockPatchJobType).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.jobTypeId).toBe(2);
        expect(res.body.pointValue).toBe(100);
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ pointValue: 100 });
        expect(res.status).toBe(403);
        expect(mockPatchJobType).not.toHaveBeenCalled();
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockPatchJobType).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
