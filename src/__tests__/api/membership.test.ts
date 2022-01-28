import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/membership';

const supertestServer = supertest(server);

describe('All unimplemented membership endpoints are reachable', () => {
    it('POST /membership/new is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/new`);
        expect(res.status).toEqual(501);
    });

    it('GET /membership/list is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/list`);
        expect(res.status).toEqual(501);
    });

    it('POST /membership/register is reachable', async () => {
        const res = await supertestServer.post(`${TAG_ROOT}/register`);
        expect(res.status).toEqual(501);
    });

    it('GET /membership/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });

    it('PATCH /membership/:id is reachable', async () => {
        const res = await supertestServer.patch(`${TAG_ROOT}/42`);
        expect(res.status).toEqual(501);
    });
});
