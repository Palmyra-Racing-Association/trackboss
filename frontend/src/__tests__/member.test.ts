import {
    createMember,
    getMember,
    updateMember,
    getMemberList,
    getFormattedMemberList,
} from '../controller/member';

// createMember
test('createMember returns new memberId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            membershipId: 0,
            memberTypeId: 0,
            firstName: 'string',
            lastName: 'string',
            phoneNumber: 'string',
            occupation: 'string',
            email: 'user@example.com',
            birthdate: '2022-01-27',
            dateJoined: '2022-01-27',
            modifiedBy: 0,
        },
    );
    if ('memberId' in res) {
        expect(res.memberId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createMember returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            firstName: 'Bad Request',
            memberTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateMember returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            firstName: 'Unauthorized',
            memberTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMember returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            firstName: 'Forbidden',
            memberTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createMember returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            firstName: 'Internal Server Error',
            memberTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getMemberList
test('getMemberList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ memberId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMemberList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token, 'valid');
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ memberId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMemberList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token, 'Badrequest');
    if ('reason' in res) {
        expect(res.reason).toEqual('Badrequest');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMemberList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token, 'Unauthorized');
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMemberList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token, 'NotFound');
    if ('reason' in res) {
        expect(res.reason).toEqual('NotFound');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMemberList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token, 'InternalServerError');
    if ('reason' in res) {
        expect(res.reason).toEqual('InternalServerError');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getMember
test('getMember returns member with valid id', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, 1);
    if ('memberId' in res) {
        expect(res.memberId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getMember returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMember returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMember returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMember returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateMember
test('updateMember returns new memberId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            firstName: '1234 New Address Street',
            modifiedBy: 42,
        },
    );
    if ('memberId' in res) {
        expect(res.memberId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateMember returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            firstName: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateMember returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            firstName: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateMember returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            firstName: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateMember returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            firstName: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

it('Mocked FormatMemberList call returns correct data', () => {
    const response = getFormattedMemberList('Test');
    expect(response.length).toBeGreaterThan(0);
});
