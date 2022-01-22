import { getByMembership, getByMember } from '../controller/workPoints';

test('getByMembership returns total with valid id', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, 1);
    expect(res.total).toEqual(3);
});

test('getByMembership returns error with invalid id', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getByMember returns total', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, 1);
    expect(res.total).toEqual(5);
});

test('getByMembership returns error with invalid id', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, -1);
    expect(res.reason).toEqual('Bad request');
});
