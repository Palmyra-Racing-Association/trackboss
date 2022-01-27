import {
    createJobType,
    getJobType,
    updateJobType,
    getJobTypeList,
} from '../controller/jobType';

// createJobType
test('createJobType returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
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

test('createJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createJobType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createJobType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createJobType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobType
test('getJobType returns membership with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, 1);
    expect(res.membership_id).toEqual(1);
});

test('getJobType returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getJobType returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getJobType returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getJobType returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateJobType
test('updateJobType returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
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

test('updateJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateJobType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateJobType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateJobType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobTypeList
test('getJobTypeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getJobTypeList(token);
    expect(res[0]).toEqual({ membership_id: 1 });
});

test('getJobTypeList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getJobTypeList(token);
    expect(res[0]).toEqual({ membership_id: 1 });
});

test('getJobTypeList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobTypeList(token);
    expect(res.reason).toEqual('Badrequest');
});

test('getJobTypeList returns 401', async () => {
    const token = '401';
    const res = await getJobTypeList(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('getJobTypeList returns 500', async () => {
    const token = '500';
    const res = await getJobTypeList(token);
    expect(res.reason).toEqual('InternalServerError');
});
