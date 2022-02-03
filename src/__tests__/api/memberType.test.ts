import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/memberType';

const supertestServer = supertest(server);

afterAll((done) => {
    server.close(done);
});

describe('All unimplemented memberType endpoints are reachable', () => {
    it('GET /memberType/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('GET /memberType/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /memberType/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
