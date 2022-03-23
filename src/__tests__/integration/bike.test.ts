import _ from 'lodash';
import supertest from 'supertest';
import server from '../../server';
import { createVerifier } from '../../util/auth';
import { mockInvalidToken, mockValidToken, mockVerifyAdmin, mockVerifyLaborer } from '../util/authMocks';
import { Bike } from '../../typedefs/bike';
import { destroyPool } from '../../database/pool';

const TAG_ROOT = '/api/bike';

const supertestServer = supertest(server);

beforeAll(() => {
    createVerifier();
});

afterAll((done) => {
    destroyPool();
    server.close(done);
});

describe('GET /bike/list', () => {
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

    it('Returns 400 for unparseable filter', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipID=q`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(400);
        expect(res.body.reason).toBe('bad request');
    });

    it('Gets the unfiltered list', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const bikes: Bike[] = res.body;
        expect(bikes.length).toBe(100);
    });

    it('Correctly filters by membershipId', async () => {
        const res = await supertestServer
            .get(`${TAG_ROOT}/list?membershipID=20`)
            .set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const bikes: Bike[] = res.body;
        expect(bikes.length).toBeGreaterThan(0);
        bikes.forEach((b: Bike) => {
            expect(b.membershipAdmin).toBe('Verile Camamile');
        });
    });
});

describe('GET /bike/:bikeId', () => {
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

    it('GETs the correct bike', async () => {
        const expBike = {
            bikeId: 1,
            year: '1995',
            make: 'Suzuki',
            model: 'TT-R230',
            membershipAdmin: 'Verile Camamile',
        };
        const res = await supertestServer.get(`${TAG_ROOT}/1`).set('Authorization', 'Bearer validtoken');
        expect(mockValidToken).toHaveBeenCalled();
        expect(res.status).toBe(200);
        const bike: Bike = res.body;
        expect(_.isEqual(bike, expBike)).toBeTruthy();
    });
});

describe('POST /bike/new', () => {
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
            .send({ membershipId: 9999 });
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
                year: 1993,
                make: 'Kawasaki',
                model: 'YZ450F',
                membershipId: 30,
            });
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
        expect(res.body.reason).toBe('forbidden');
    });

    it('Successfully inserts a bike', async () => {
        const res = await supertestServer
            .post(`${TAG_ROOT}/new`)
            .set('Authorization', 'Bearer admin')
            .send({
                year: 1993,
                make: 'Kawasaki',
                model: 'YZ450F',
                membershipId: 30,
            });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(201);
        const bike: Bike = res.body;
        // would be 101, but the bad input test above makes the db skip 101
        expect(bike.bikeId).toBe(102);
    });
});

describe('PATCH /bike/:bikeId', () => {
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
            .send({ membershipId: 9999 });
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
            .send({ make: 'newMake' });
        expect(mockVerifyLaborer).toHaveBeenCalled();
        expect(res.status).toBe(403);
    });

    it('Returns 404 when bad id is specified', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/9999`)
            .set('Authorization', 'Bearer admin')
            .send({ make: 'newMake' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Returns 404 on unparseable id', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/q`).set('Authorization', 'Bearer admin');
        expect(res.status).toBe(404);
        expect(res.body.reason).toBe('not found');
    });

    it('Successfully patches a bike', async () => {
        const res = await supertestServer
            .patch(`${TAG_ROOT}/3`)
            .set('Authorization', 'Bearer admin')
            .send({ make: 'newMake' });
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.bikeId).toBe(3);
        expect(res.body.make).toBe('newMake');
    });
});

describe('DELETE /bike/:bikeId', () => {
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

    it('Successfully deletes a bike', async () => {
        const res = await supertestServer
            .delete(`${TAG_ROOT}/42`)
            .set('Authorization', 'Bearer admin');
        expect(mockVerifyAdmin).toHaveBeenCalled();
        expect(res.status).toBe(200);
        expect(res.body.bikeId).toBe(42);
    });
});
