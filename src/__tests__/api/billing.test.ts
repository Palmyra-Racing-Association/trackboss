import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/billing';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All implemented (but untested) billing endpoints are reachable', () => {
    it('GET /billing/yearlyWorkPointThreshold is reachable', async () => {
        await supertestServer.get(`${TAG_ROOT}/yearlyWorkPointThreshold`);
    });

    it('GET /billing/list is reachable', async () => {
        await supertestServer.get(`${TAG_ROOT}/list`);
    });

    it('GET /billing/:id is reachable', async () => {
        await supertestServer.get(`${TAG_ROOT}/42`);
    });

    it('POST /billing/:id is reachable', async () => {
        await supertestServer.post(`${TAG_ROOT}/42`);
    });

    it('POST /billing is reachable', async () => {
        await supertestServer.post(`${TAG_ROOT}`);
    });
});
