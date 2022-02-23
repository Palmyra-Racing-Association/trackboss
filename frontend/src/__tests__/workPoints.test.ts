import { getByMembership, getByMember } from '../controller/workPoints';

// byMembership
test('getByMembership returns total with valid id', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, 1);
    if ('total' in res) {
        expect(res.total).toEqual(3);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getByMembership returns 400', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMembership returns 401', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMembership returns 404', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMembership returns 500', async () => {
    const token = 'TestingToken';
    const res = await getByMembership(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// byMember
test('getByMember returns total with valid id', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, 1);
    if ('total' in res) {
        expect(res.total).toEqual(5);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getByMember returns 400', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMember returns 401', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMember returns 404', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getByMember returns 500', async () => {
    const token = 'TestingToken';
    const res = await getByMember(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
