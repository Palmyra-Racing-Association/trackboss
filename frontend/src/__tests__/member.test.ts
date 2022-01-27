import {
    createMember,
    getMember,
    updateMember,
    getMemberList,
} from '../controller/member';

// createMember
test('createMember returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            membershd: 0,
            member_type_id: 0,
            first_name: "string",
            last_name: "string",
            phone_number: "string",
            occupation: "string",
            email: "user@example.com",
            birthdate: "2022-01-27",
            date_joined: "2022-01-27",
            modified_by: 0
        },
    );
    expect(res.member_id).toEqual(1);
});

test('createMember returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateMember returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createMember returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createMember returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createMember(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getMember
test('getMember returns membership with valid id', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, 1);
    expect(res.membershd).toEqual(1);
});

test('getMember returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getMember returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getMember returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getMember returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMember(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateMember
test('updateMember returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
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
    expect(res.membershd).toEqual(1);
});

test('updateMember returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateMember returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateMember returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateMember returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateMember(
        token,
        1,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getMemberList
test('getMemberList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res[0]).toEqual({ member_id: 1 });
});

test('getMemberList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res[0]).toEqual({ member_id: 1 });
});

test('getMemberList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res.reason).toEqual('Badrequest');
});

test('getMemberList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('getMemberList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res.reason).toEqual('NotFound');
});

test('getMemberList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getMemberList(token);
    expect(res.reason).toEqual('InternalServerError');
});
