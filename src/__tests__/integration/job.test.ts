import { isEqual } from 'lodash';
import { format, isAfter, isBefore } from 'date-fns';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyLaborer } from '../util/authMocks';
import { Job } from '../../typedefs/job';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/job';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /job/list', () => {
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

    it('Returns 400 for unparseable filter assignmentStatus', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?assignmentStatus=notafilter`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for unparseable filter verificationStatus', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?verificationStatus=notafilter`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for unparseable filter memberID', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?memberID=notafilter`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for unparseable filter membershipID', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipID=notafilter`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for unparseable filter eventID', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?eventID=notafilter`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBe(393);
    });

    it('Correctly filters by assignment Status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?assignmentStatus=assigned`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBeGreaterThan(0);
        jobs.forEach((j: Job) => {
            expect(j.member).toBeDefined();
        });
    });

    it('Correctly filters by verification Status', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?verificationStatus=pending`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBeGreaterThan(0);
        jobs.forEach((j: Job) => {
            expect(j.verified).toBe(false);
        });
    });

    it('Correctly filters by memberId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?memberID=19`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBeGreaterThan(0);
        jobs.forEach((j: Job) => {
            expect(j.member).toBe('Verile Camamile');
        });
    });

    // it('Correctly filters by membershipId', async () => {
    //     const res = await supertestServer
    //         .get(`${TAG_ROOT}/list?membershipID=19`)
    //         .set('Authorization', 'Bearer validtoken');
    //     expect(mockValidToken).toHaveBeenCalled();
    //     expect(res.status).toBe(200);
    //     const jobs: Job[] = res.body;
    //     expect(jobs.length).toBeGreaterThan(0);
    //     jobs.forEach((j: Job) => {
    //         expect(j.member).toBe('Verile Camamile');
    //     });
    // }); // How can we test this one

    it('Correctly filters by eventId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?eventID=6`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const jobs: Job[] = res.body;
        expect(jobs.length).toBeGreaterThan(0);
        jobs.forEach((j: Job) => {
            expect(j.event).toBe('2022 first race');
        });
    });

    it('Correctly filters with just start', async () => {
        const startBound = new Date('2022-09-01');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', `${format(startBound, 'yyyyMMdd')}-`);
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        jobs.forEach((j:Job) => {
            const jDate = new Date(j.start);
            expect(isAfter(jDate, startBound) || isEqual(jDate, startBound)).toBeTruthy();
        });
    });

    it('Correctly filters with just end', async () => {
        const endBound = new Date('2022-09-01');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '-20220901');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        jobs.forEach((j:Job) => {
            const jDate = new Date(j.start);
            expect(isBefore(jDate, endBound) || isEqual(jDate, endBound)).toBeTruthy();
        });
    });

    it('Correctly filters with both start and end', async () => {
        const startBound = new Date('2020-09-01');
        const endBound = new Date('2022-09-01');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '20200901-20220901');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const jobs: Job[] = res.body;
        jobs.forEach((j:Job) => {
            const jDate = new Date(j.start);
            expect((isBefore(jDate, endBound) && isAfter(jDate, startBound)) || isEqual(jDate, endBound)).toBeTruthy();
        });
    });
});

describe('GET /job/:jobId', () => {
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

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('GETs the correct job', async () => {
        const expJob = {
            jobId: 1,
            member: 'Isobel Jennery',
            event: 'The First Race',
            eventId: 1,
            start: '2020-02-01T00:00:00.000Z',
            end: '2020-02-01T00:00:00.000Z',
            title: 'Practice Flagger 6 - Double Double',
            verified: true,
            verifiedDate: '2020-02-15',
            pointsAwarded: 3,
            paid: false,
            paidDate: null,
            lastModifiedDate: '2020-02-15',
            lastModifiedBy: 'Squeak Trainywhel',
        };
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const job: Job = res.body;
        expect(job).toEqual(expJob);
    });
});

describe('POST /job/new', () => {
    it('Returns 400 for no input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for bad user input', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                jobTypeId: 200,
                eventId: 200,
                startDate: '2023-01-01 08:00:00',
                modifiedBy: 1000,
                verified: false,
                paid: false,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
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

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer laborer')
            .send({
                jobTypeId: 2,
                eventId: 2,
                startDate: '2023-01-01 08:00:00',
                modifiedBy: 1,
            });
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a job', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                jobTypeId: 2,
                eventId: 2,
                startDate: '2023-01-01 08:00:00',
                modifiedBy: 1,
                verified: false,
                paid: false,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const job: Job = res.body;
        expect(job.jobId).toBe(395);
    });
});

describe('PATCH /job/:jobId', () => {
    it('Returns 400 for no input', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/1`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/1`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 5555 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/1`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/1`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ memberId: 5 });
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/9999`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 5 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a job', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/3`)
            .set('Authorization', 'Bearer admin')
            .send({ memberId: 5 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.jobId).toBe(3);
        expect(res.body.member).toBe('Louie Olivazzi');
    });
});

describe('DELETE /job/:jobId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/42`)
            .set('Authorization', 'Bearer laborer');
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/9999`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes a job', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/39`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.jobId).toBe(39);
    });
});
