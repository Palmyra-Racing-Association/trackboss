import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/event';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented event endpoints are reachable', () => {
    it('POST /event/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /event/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('GET /event/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /event/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('DELETE /event/:id is reachable', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
