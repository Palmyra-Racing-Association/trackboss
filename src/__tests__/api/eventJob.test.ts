import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import {
    eventJobList,
    mockDeleteEventJob,
    mockGetEventJob,
    mockInsertEventJob,
    mockPatchEventJob,
} from './mocks/eventJob';
import { mockGetMember } from './mocks/member';
import { EventJob } from '../../typedefs/eventJob';

const TAG_ROOT = '/api/eventJob';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /eventJob/:eventJobId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEventJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the correct eventJob', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEventJob).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const eventJob: EventJob = res.body;
        expect(eventJob).toEqual(eventJobList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEventJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /eventJob/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(mockInsertEventJob).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertEventJob).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertEventJob).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertEventJob).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                eventJobId: 0,
                jobTypeId: 0,
                count: 0,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockVerifyAdmin).not.toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts an eventJob', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                eventJobId: 0,
                jobTypeId: 0,
                count: 0,
            });
        expect(mockInsertEventJob).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetEventJob).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const eventJob: EventJob = res.body;
        expect(eventJob.eventJobId).toBe(eventJobList[eventJobList.length - 1].eventJobId);
        expect(eventJob).toEqual(eventJobList[eventJobList.length - 1]);
    });
});

describe('PATCH /eventJob/:eventJobId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchEventJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchEventJob).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches an eventJob', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ count: 100 });
        expect(res.status).toBe(200);
        expect(res.body.eventJobId).toBe(0);
        expect(res.body.count).toBe(100);
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ count: 100 });
        expect(res.status).toBe(403);
        expect(mockPatchEventJob).not.toHaveBeenCalled();
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchEventJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('DELETE /eventJob/:eventJobId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEventJob).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`);
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes an eventJob', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin');
        expect(mockDeleteEventJob).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.eventJobId).toBe(0);
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
        expect(mockDeleteEventJob).not.toHaveBeenCalled();
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEventJob).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
