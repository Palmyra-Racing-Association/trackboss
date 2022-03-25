import { format, isAfter, isBefore, isEqual } from 'date-fns';
import supertest from 'supertest';
import server from '../../server';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyMember } from '../util/authMocks';
import { Event } from '../../typedefs/event';
import { mockGetMember } from '../api/mocks/member';
import { createVerifier } from '../../util/auth';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/event';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /event/list', () => {
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
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const events: Event[] = res.body;
        expect(events.length).toBe(6);
    });

    it('Correctly filters with just start', async () => {
        const startBound = new Date('2021-03-16');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', `${format(startBound, 'yyyyMMdd')}-`);
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBeGreaterThan(0);
        events.forEach((e: Event) => {
            const eDate = new Date(e.start);
            expect(isAfter(eDate, startBound) || isEqual(eDate, startBound)).toBeTruthy();
        });
    });

    it('Correctly filters with just end', async () => {
        const endBound = new Date('2022-01-01');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', `-${format(endBound, 'yyyyMMdd')}`);
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBeGreaterThan(0);
        events.forEach((e: Event) => {
            const eDate = new Date(e.start);
            expect(isBefore(eDate, endBound) || isEqual(eDate, endBound)).toBeTruthy();
        });
    });

    it('Correctly filters with both start and end', async () => {
        const startBound = new Date('2022-02-01');
        const endBound = new Date('2022-02-28');
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', `${format(startBound, 'yyyyMMdd')}-${format(endBound, 'yyyyMMdd')}`);
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(206);
        const events: Event[] = res.body;
        expect(events.length).toBeGreaterThan(0);
        events.forEach((e: Event) => {
            const eDate = new Date(e.start);
            const evalStartBound = isAfter(eDate, startBound) || isEqual(eDate, startBound);
            const evalEndBound = isBefore(eDate, endBound) || isEqual(eDate, endBound);
            expect(evalStartBound && evalEndBound).toBeTruthy();
        });
    });

    it('Returns 400 for illegal date format', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 400 for illegal date format with -', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list`)
            .set('Authorization', 'Bearer validtoken')
            .set('Range', 'iamanevilstring-nowwithmorehyphen');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });
});

describe('GET /event/:eventId', () => {
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

    it('GETs the correct event', async () => {
        const expEvent = {
            eventId: 2,
            start: '2022-05-15 10:00:00',
            end: '2022-05-19 10:00:00',
            eventType: 'XO Race',
            title: 'XO Race',
            eventDescription: 'Test XO Race Job Generation',
        };
        const res = await supertestServer.get(`${TAG_ROOT}/2`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const event: Event = res.body;
        expect(event).toEqual(expEvent);
    });

    it('Returns 404 when no data found', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/7`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 when bad parameter', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/imbadtothebone`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });
});

describe('POST /event/new', () => {
    it('Returns 400 on bad input', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({ eventTypeId: 9999 });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 401 for no token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toBe(401);
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`).set('Authorization', 'Bearer invalidtoken');
        expect(res.status).toBe(401);
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer member')
            .send({
                startDate: '2022-03-26T13:11:12',
                endDate: '2022-03-27T13:11:12',
                eventTypeId: 1,
                eventName: 'New Event',
                eventDescription: 'testing',
            });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts an event', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                startDate: '2022-03-26T13:11:12',
                endDate: '2022-03-27T13:11:12',
                eventTypeId: 1,
                eventName: 'New Event',
                eventDescription: 'testing',
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const event: Event = res.body;
        expect(event.eventId).toBe(8);
    });
});

describe('PATCH /event/:eventId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 400 on user input error', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/2`).set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer member')
            .send({ eventName: 'newEventName' });
        expect(mockVerifyMember).toHaveBeenCalled();
        expect(res.status).toBe(403);
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/9999`)
            .set('Authorization', 'Bearer admin')
            .send({ eventName: 'newEventName' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/q`)
            .set('Authorization', 'Bearer admin')
            .send({ eventName: 'newEventName' });
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches an event', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/2`)
            .set('Authorization', 'Bearer admin')
            .send({ eventName: 'newEventName' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.eventId).toBe(2);
        expect(res.body.title).toBe('newEventName');
    });
});

describe('DELETE /event/:eventId', () => {
    it('Returns 401 for no token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/6`);
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('Missing authorization grant in header');
    });

    it('Returns 401 for invalid token', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/6`).set('Authorization', 'Bearer invalidtoken');
        expect(mockInvalidToken).toHaveBeenCalled();
        expect(res.status).toBe(401);
        expect(res.body.reason).toBe('not authorized');
    });

    it('Returns 403 for insufficient permissions', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/6`)
            .set('Authorization', 'Bearer member');
        expect(mockVerifyMember).toHaveBeenCalled();
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

    it('Successfully deletes an event', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/6`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.eventId).toBe(6);
    });
});
