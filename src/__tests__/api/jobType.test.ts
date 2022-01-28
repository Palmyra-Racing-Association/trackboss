import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/jobType';

const supertestServer = supertest(server);

describe('All unimplemented jobType endpoints are reachable', () => {
    it('POST /jobType/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /jobType/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('GET /jobType/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /jobType/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
