import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockVerifyMember, mockVerifyAdmin } from '../util/authMocks';
import { EventType } from '../../typedefs/eventType';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/eventType';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
    destroyPool();
});

describe('GET /eventType/list', () => {
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
        const eventTypes: EventType[] = res.body;
        expect(eventTypes.length).toBe(9);
        _.forEach(eventTypes, (eventType: EventType, index) => {
            expect(eventType.eventTypeId).toBe(index + 1);
        });
        expect(eventTypes[0].type).toBe('Race');
        expect(eventTypes[6].type).toBe('Work Day');
        expect(eventTypes[8].type).toBe('Ride Day');
    });
});

describe('POST /eventType/new', () => {
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
                type: 'new event type',
                modifiedBy: 42,
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts an eventType', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                type: 'new event type',
                modifiedBy: 42,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const eventType: EventType = res.body;
        expect(eventType.eventTypeId).toBe(10);
        expect(eventType.type).toBe('new event type');
        expect(eventType.lastModifiedBy).toBe('Dionne Kleinhaut');
    });
});

describe('GET /eventType/:eventTypeId', () => {
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

    it('GETs the correct event type', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(200);
        const eventType: EventType = res.body;
        expect(eventType.eventTypeId).toBe(1);
        expect(eventType.type).toBe('Race');
        expect(eventType.active).toBe(true);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/17`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('PATCH /eventType/:eventTypeId', () => {
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

    it('Successfully patches an eventType type', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ type: 'test', modifiedBy: 2 });
        expect(res.status).toBe(200);
        expect(res.body.eventTypeId).toBe(2);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer laborer')
            .send({ type: 'test' });
        expect(res.status).toBe(403);
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/17`)
            .set('Authorization', 'Bearer admin')
            .send({ type: 'test' });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('returns 400 for FK violation', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/4`)
            .set('Authorization', 'Bearer admin')
            .send({ modifiedBy: 1043 });
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});
