import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/job';

const supertestServer = supertest(server);

describe('All unimplemented job endpoints are reachable', () => {
    it('POST /job/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /job/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('GET /job/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /job/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('POST /job/:id is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('DELETE /job/:id is reachable', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
