import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockVerifyMember, mockVerifyAdmin } from '../util/authMocks';
import { EventType } from '../../typedefs/eventType';
import { EventJob } from '../../typedefs/eventJob';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/eventJob';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('POST /eventJob/new', () => {
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

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                eventTypeId: 8,
                jobTypeId: 2,
                count: 3,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts an event Job', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                eventTypeId: 8,
                jobTypeId: 2,
                count: 3,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const eventJob: EventJob = res.body;
        expect(eventJob.eventType).toBe('Camp and Ride');
        expect(eventJob.jobType).toBe('Scoring');
        expect(eventJob.count).toBe(3);
    });
});

describe('GET /eventJob/:eventJobId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct event job', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const eventJob: EventJob = res.body;
        expect(eventJob.eventJobId).toBe(1);
        expect(eventJob.eventType).toBe('Harescramble');
        expect(eventJob.jobType).toBe('Facility Cleanup');
        expect(eventJob.count).toBe(1);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1700`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /eventJob/:eventJobId', () => {
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

    it('Successfully patches an eventJob type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/1`)
            .set('Authorization', 'Bearer admin')
            .send({ count: 2 });
        expect(res.status).toBe(200);
        expect(res.body.count).toBe(2);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ count: 1 });
        expect(res.status).toBe(403);
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/170`)
            .set('Authorization', 'Bearer admin')
            .send({ count: 1 });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 400 for FK violation', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/4`)
            .set('Authorization', 'Bearer admin')
            .send({ eventTypeId: 1043 });
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});
describe('DELETE /eventJob/:eventJobId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/5`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });
    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/5`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });
    it('Successfully deletes an event job', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/10`)
            .set('Authorization', 'Bearer admin');
        expect(res.status).toBe(200);
    });
    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
    });
    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/1074`)
            .set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
