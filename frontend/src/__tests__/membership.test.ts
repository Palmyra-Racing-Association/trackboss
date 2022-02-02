import {
    createMembership,
    getMembership,
    updateMembership,
    registerMembership,
    getMembershipList,
} from '../controller/membership';

// createMembership
test('createMembership returns new memberId with valid data', async () => {
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
    expect(res.membershipId).toEqual(1);
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
    expect(res.membershipId).toEqual(1);
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
test('createMembership returns new memberId with valid data', async () => {
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
    expect(res.membershipId).toEqual(1);
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
test('getMembershipList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token);
    expect(res[0]).toEqual({ membershipId: 1 });
});

test('getMembershipList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'valid');
    expect(res[0]).toEqual({ membershipId: 1 });
});

test('getMembershipList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Badrequest');
    expect(res.reason).toEqual('Badrequest');
});

test('getMembershipList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Unauthorized');
    expect(res.reason).toEqual('Unauthorized');
});

test('getMembershipList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'NotFound');
    expect(res.reason).toEqual('NotFound');
});

test('getMembershipList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'InternalServerError');
    expect(res.reason).toEqual('InternalServerError');
});

// registerMembership
test('registerMembership returns new memberId with valid data', async () => {
    const res = await registerMembership(
        {
            memberTypeId: 0,
            firstName: 'string',
            lastName: 'string',
            phoneNumber: 'string',
            occupation: 'string',
            email: 'user@example.com',
            birthdate: '2022-01-27',
            address: 'string',
            city: 'string',
            state: 'string',
            zip: 'string',
        },
    );
    expect(res.memberType).toEqual('new member');
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
