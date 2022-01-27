import {
    createMembership,
    getMembership,
    updateMembership,
    registerMembership,
    getMembershipList,
} from '../controller/membership';

// createMembership
test('createMembership returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            year_joined: 1995,
            address: 'test string',
            city: 'test string',
            state: 'test string',
            zip: 'test string',
            modified_by: 0,
        },
    );
    expect(res.membership_id).toEqual(1);
});

test('createMembership returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createMembership returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createMembership returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createMembership returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getMembership
test('getMembership returns membership with valid id', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, 1);
    expect(res.membership_id).toEqual(1);
});

test('getMembership returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getMembership returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getMembership returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getMembership returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateMembership
test('createMembership returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateMembership(
        token,
        1,
        {
            address: '1234 New Address Street',
            city: 'Hoboken',
            state: 'NJ',
            zip: 7030,
            modified_by: 42,
        },
    );
    expect(res.membership_id).toEqual(1);
});

test('createMembership returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createMembership returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createMembership returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createMembership returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getMembershipList
test('getMembershipList returns list with valid id', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'valid');
    expect(res[0]).toEqual({ membership_id: 1 });
});

test('getMembershipList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Bad request');
    expect(res.reason).toEqual('Bad request');
});

test('getMembershipList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Unauthorized');
    expect(res.reason).toEqual('Unauthorized');
});

test('getMembershipList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Not Found');
    expect(res.reason).toEqual('Not Found');
});

test('getMembershipList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Internal Server Error');
    expect(res.reason).toEqual('Internal Server Error');
});

// registerMembership
test('registerMembership returns new member_id with valid data', async () => {
    const res = await registerMembership(
        {
            member_type_id: 0,
            first_name: 'string',
            last_name: 'string',
            phone_number: 'string',
            occupation: 'string',
            email: 'user@example.com',
            birthdate: '2022-01-27',
            address: 'string',
            city: 'string',
            state: 'string',
            zip: 'string',
        },
    );
    expect(res.member_type).toEqual('new member');
});

test('registerMembership returns bad request', async () => {
    const res = await registerMembership(
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('registerMembership returns unauthorized', async () => {
    const res = await registerMembership(
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('registerMembership returns forbidden', async () => {
    const res = await registerMembership(
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('registerMembership returns internal server error', async () => {
    const res = await registerMembership(
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});
