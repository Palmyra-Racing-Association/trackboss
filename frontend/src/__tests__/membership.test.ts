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
            yearJoined: 1995,
            address: 'test string',
            city: 'test string',
            state: 'test string',
            zip: 'test string',
            modifiedBy: 0,
        },
    );
    if ('membershipId' in res) {
        expect(res.membershipId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createMembership returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getMembership
test('getMembership returns membership with valid id', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, 1);
    if ('membershipId' in res) {
        expect(res.membershipId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMembership returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembership returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembership returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembership returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMembership(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
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
            zip: '7030',
            renewalSent: false,
            modifiedBy: 42,
        },
    );
    if ('membershipId' in res) {
        expect(res.membershipId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createMembership returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMembership returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMembership(
        token,
        {
            address: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getMembershipList
test('getMembershipList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ membershipId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMembershipList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'valid');
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ membershipId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMembershipList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Badrequest');
    if ('reason' in res) {
        expect(res.reason).toEqual('Badrequest');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembershipList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'Unauthorized');
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembershipList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'NotFound');
    if ('reason' in res) {
        expect(res.reason).toEqual('NotFound');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMembershipList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMembershipList(token, 'InternalServerError');
    if ('reason' in res) {
        expect(res.reason).toEqual('InternalServerError');
    } else {
        throw new Error('Received unexpected non-error response');
    }
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
    if ('memberType' in res) {
        expect(res.memberType).toEqual('new member');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('registerMembership returns bad request', async () => {
    const res = await registerMembership(
        {
            address: 'Bad Request',
            memberTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('registerMembership returns unauthorized', async () => {
    const res = await registerMembership(
        {
            address: 'Unauthorized',
            memberTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('registerMembership returns forbidden', async () => {
    const res = await registerMembership(
        {
            address: 'Forbidden',
            memberTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('registerMembership returns internal server error', async () => {
    const res = await registerMembership(
        {
            address: 'Internal Server Error',
            memberTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
