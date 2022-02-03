import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/billing';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented billing endpoints are reachable', () => {
    it('GET /billing/yearlyWorkPointThreshold is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/yearlyWorkPointThreshold`);
        expect(res.status).toEqual(501);
    });

    it('GET /billing/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('GET /billing/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('POST /billing/:id is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('POST /billing is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}`);
        expect(res.status).toEqual(501);
    });
});
