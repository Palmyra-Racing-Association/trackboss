import { getByMembership, getByMember } from '../controller/workPoints';

test('getByMembership returns total with valid id', async () => {
    const res = await getByMembership(1);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ total: 3 });
});

test('getByMembership returns error with invalid id', async () => {
    const res = await getByMembership(-1);
    expect(res.status).toBe(400);
});

test('getByMember returns total', async () => {
    const res = await getByMember(1);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ total: 5 });
});

test('getByMembership returns error with invalid id', async () => {
    const res = await getByMember(-1);
    expect(res.status).toBe(400);
});
