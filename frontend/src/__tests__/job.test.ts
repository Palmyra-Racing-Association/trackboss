import {
    createJob,
    getJob,
    updateJob,
    getJobList,
    cloneJob,
    deleteJob,
} from '../controller/job';

// createJob
test('createJob returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJob(
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

test('createJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJob
test('getJob returns membership with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, 1);
    expect(res.membership_id).toEqual(1);
});

test('getJob returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getJob returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getJob returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getJob returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateJob
test('updateJob returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
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

test('updateJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobList
test('getJobList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token);
    expect(res[0]).toEqual({ membership_id: 1 });
});

test('getJobList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'valid');
    expect(res[0]).toEqual({ membership_id: 1 });
});

test('getJobList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'Badrequest');
    expect(res.reason).toEqual('Badrequest');
});

test('getJobList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'Unauthorized');
    expect(res.reason).toEqual('Unauthorized');
});

test('getJobList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'NotFound');
    expect(res.reason).toEqual('NotFound');
});

test('getJobList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'InternalServerError');
    expect(res.reason).toEqual('InternalServerError');
});

// cloneJob
test('cloneJob returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(
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

test('cloneJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('cloneJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('cloneJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('cloneJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});