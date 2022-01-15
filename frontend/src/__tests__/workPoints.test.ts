import { getByMembership } from '../controller/workPoints';

test('handler returns total', async () => {
    // This is calling our controller, but is intercepted by the MSW handler
    const res = await getByMembership(1);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ total: 3 });
});
