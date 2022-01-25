import { getByMembership, getByMember } from '../controller/workPoints';

// byMembership
test('getByMembership returns total with valid id', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, 1);
    expect(res.total).toEqual(3);
});

test('getByMembership returns 400', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getByMembership returns 401', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getByMembership returns 404', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getByMembership returns 500', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// byMember
test('getByMember returns total with valid id', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, 1);
    expect(res.total).toEqual(5);
});

test('getByMember returns 400', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getByMember returns 401', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getByMember returns 404', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getByMember returns 500', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});
