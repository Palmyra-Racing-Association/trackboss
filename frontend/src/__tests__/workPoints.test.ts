import { getByMembership, getByMember } from '../controller/workPoints';

test('getByMembership returns total with valid id', async () => {
    const res = await getByMembership(1);
    expect(res).toEqual(3);
});

test('getByMembership returns error with invalid id', async () => {
    const res = await getByMembership(-1);
    expect(res).toEqual('error: endpoint not found');
});

test('getByMember returns total', async () => {
    const res = await getByMember(1);
    expect(res).toEqual(5);
});

test('getByMembership returns error with invalid id', async () => {
    const res = await getByMember(-1);
    expect(res).toEqual('error: endpoint not found');
});
