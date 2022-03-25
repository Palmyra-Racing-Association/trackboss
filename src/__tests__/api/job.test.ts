import supertest from 'supertest';
import server from '../../server';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { Job } from '../../typedefs/job';
import {
    jobList,
    mockDeleteJob,
    mockGetJob,
    mockGetJobList,
    mockInsertJob,
    mockPatchJob,
} from './mocks/job';
import { mockGetMember } from './mocks/member';
import { createVerifier } from '../../util/auth';

const TAG_ROOT = '/api/job';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /job/:jobId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct job', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJob).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const job: Job = res.body;
        expect(job).toEqual(jobList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad parameter', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/imbadtothebone`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJob).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('GET /job/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetJobList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBe(jobList.length);
        expect(jobs[0]).toEqual(jobList[0]);
        expect(jobs[1]).toEqual(jobList[1]);
    });

    it('Correctly filters with just start', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '20220901-');
        expect(mockGetJobList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBe(2);
        expect(jobs[0]).toEqual(jobList[2]);
    });

    it('Correctly filters with just end', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '-20220720');
        expect(mockGetJobList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBe(1);
        expect(jobs[0]).toEqual(jobList[0]);
    });

    it('Correctly filters with both start and end', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '20220801-20220831');
        expect(mockGetJobList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBe(1);
        expect(jobs[0]).toEqual(jobList[1]);
    });

    it('returns 400 for illegal assignment status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?assignmentStatus=notastatus`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal verification status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?verificationStatus=notastatus`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal memberId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?memberID=notanumber`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal eventId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?eventID=notanumber`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal membershipId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipID=notanumber`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal date format', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal date format with -', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring-nowwithmorehyphen');
        expect(mockGetJobList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});

describe('POST /job/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertJob).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertJob).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertJob).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertJob).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                startDate: '2022-12-12 9:00:00',
                endDate: '2022-12-14 22:00:00',
                jobTypeId: 3,
                modifiedBy: 3,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockInsertJob).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('successfully inserts a job', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                startDate: '2022-12-12 9:00:00',
                endDate: '2022-12-14 22:00:00',
                jobTypeId: 3,
                modifiedBy: 3,
            });
        expect(mockInsertJob).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const job: Job = res.body;
        expect(job.jobId).toBe(jobList[jobList.length - 1].jobId);
        expect(job).toEqual(jobList[jobList.length - 1]);
    });
});

describe('PATCH /job/:jobId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockPatchJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchJob).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchJob).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a job', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ pointsAwarded: 3 });
        expect(res.status).toBe(200);
        expect(res.body.jobId).toBe(0);
        expect(res.body.pointsAwarded).toBe(3);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ pointsAwarded: 2 });
        expect(res.status).toBe(403);
        expect(mockPatchJob).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('DELETE /job/:jobId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockDeleteJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`);
        expect(mockDeleteJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockDeleteJob).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes a job', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin');
        expect(mockDeleteJob).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.jobId).toBe(0);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
        expect(mockDeleteJob).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockDeleteJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
