import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/eventJob';

const supertestServer = supertest(server);

afterAll(() => {
    server.close();
});

describe('All unimplemented eventJob endpoints are reachable', () => {
    it('POST /eventJob/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /eventJob/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /eventJob/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('DELETE /eventJob/:id is reachable', async () => {
        const res = await supertestServer.delete(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
