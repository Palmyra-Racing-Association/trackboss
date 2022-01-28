import supertest from 'supertest';
import server from '../../server';

const TAG_ROOT = '/api/workPoints';

const supertestServer = supertest(server);

describe('All unimplemented workPoints endpoints are reachable', () => {
    it('GET /workPoints/byMember/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/byMember/42`);
        expect(res.status).toEqual(501);
    });

    it('GET /workPoints/byMembership/:id is reachable', async () => {
        const res = await supertestServer.get(`${TAG_ROOT}/byMembership/42`);
        expect(res.status).toEqual(501);
    });
});
