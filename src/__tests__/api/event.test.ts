import supertest from 'supertest';
import server from '../../server';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { Event } from '../../typedefs/event';
import {
    eventList,
    mockDeleteEvent,
    mockGetEvent,
    mockGetEventList,
    mockInsertEvent,
    mockPatchEvent,
} from './mocks/event';
import { mockGetMember } from './mocks/member';
import { createVerifier } from '../../util/auth';

const TAG_ROOT = '/api/event';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    server.close(done);
});

describe('GET /event/list', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(res.status).toBe(500);
        expect(mockValidToken).toHaveBeenCalled();
        expect(mockGetEventList).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(mockGetEventList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetEventList).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEventList).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const events: Event[] = res.body;
        expect(events.length).toBe(eventList.length);
        expect(events[0]).toEqual(eventList[0]);
        expect(events[1]).toEqual(eventList[1]);
    });

    it('Correctly filters with just start', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '20220901-');
        expect(mockGetEventList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBe(1);
        expect(events[0]).toEqual(eventList[2]);
    });

    it('Correctly filters with just end', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '-20220720');
        expect(mockGetEventList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBe(1);
        expect(events[0]).toEqual(eventList[0]);
    });

    it('Correctly filters with both start and end', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', '20220801-20220831');
        expect(mockGetEventList).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBe(1);
        expect(events[0]).toEqual(eventList[1]);
    });

    it('returns 400 for illegal date format', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring');
        expect(mockGetEventList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('returns 400 for illegal date format with -', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring-nowwithmorehyphen');
        expect(mockGetEventList).not.toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});

describe('GET /event/:eventId', () => {
    it('Returns 500 on Internal Server Error', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/400`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEvent).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`);
        expect(mockGetEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('GETs the correct event', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEvent).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const event: Event = res.body;
        expect(event).toEqual(eventList[1]);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEvent).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad parameter', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/imbadtothebone`).set('Authorization', 'Bearer validtoken');
        expect(mockGetEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /event/new', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(500);
        expect(mockInsertEvent).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 400 on bad input', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(400);
        expect(mockInsertEvent).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockInsertEvent).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockInsertEvent).not.toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                start: '2022-12-12 9:00:00',
                end: '2022-12-14 22:00:00',
                eventType: 'race',
                title: 'Big Testing Event 4',
                eventDescription: 'i ran out of things to say',
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockInsertEvent).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('successfully inserts an event', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                start: '2022-12-12 9:00:00',
                end: '2022-12-14 22:00:00',
                eventType: 'race',
                title: 'Big Testing Event 4',
                eventDescription: 'i ran out of things to say',
            });
        expect(mockInsertEvent).toHaveBeenCalled();
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const event: Event = res.body;
        expect(event.eventId).toBe(eventList[eventList.length - 1].eventId);
        expect(event).toEqual(eventList[eventList.length - 1]);
    });
});

describe('PATCH /event/:eventId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchEvent).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`);
        expect(mockPatchEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockPatchEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockPatchEvent).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockPatchEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches an event', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin')
            .send({ type: 'fire' });
        expect(res.status).toBe(200);
        expect(res.body.eventId).toBe(0);
        expect(res.body.type).toBe('fire');
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer')
            .send({ type: 'ghost' });
        expect(res.status).toBe(403);
        expect(mockPatchEvent).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockPatchEvent).toHaveBeenCalled();
        expect(mockGetEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('DELETE /event/:eventId', () => {
    it('Returns 500 on internal server error', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEvent).toHaveBeenCalled();
        expect(res.status).toBe(500);
        expect(res.body.reason).toBe('internal server error');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`);
        expect(mockDeleteEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/0`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockDeleteEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEvent).not.toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully deletes an event', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer admin');
        expect(mockDeleteEvent).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.eventId).toBe(0);
    });

    it('returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/0`)
            .set('Authorization', 'Bearer laborer');
        expect(res.status).toBe(403);
        expect(mockDeleteEvent).not.toHaveBeenCalled();
    });

    it('returns 404 when bad id is specified', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/17`).set('Authorization', 'Bearer admin');
        expect(mockDeleteEvent).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});
