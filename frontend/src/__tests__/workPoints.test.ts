import { getByMembership } from '../controller/workPoints';

test('handler returns total', async () => {
    // This is calling our controller, but is intercepted by the MSW handler
    const res = await getByMembership(1);
    console.log(res); // For some reason, i cant get the body from the test
    expect(res.status).toBe(200);
});
