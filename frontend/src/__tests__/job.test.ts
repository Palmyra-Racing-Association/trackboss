import {
    createJob,
    getJob,
    updateJob,
    getJobList,
    cloneJob,
    deleteJob,
} from '../controller/job';

// createJob
test('createJob returns new job_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            member_id: 0,
            event_id: 0,
            job_type_id: 0,
            job_date: '2022-01-27',
            points_awarded: 0,
            modified_by: 0,
        },
    );
    expect(res.job_id).toEqual(1);
});

test('createJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            job_date: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            job_date: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            job_date: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            job_date: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJob
test('getJob returns job with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, 1);
    expect(res.job_id).toEqual(1);
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
test('updateJob returns new job_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
        },
    );
    expect(res.job_id).toEqual(1);
});

test('updateJob returns bad request', async () => {
    const token = 'Bad Request';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateJob returns unauthorized', async () => {
    const token = 'Unauthorized';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateJob returns forbidden', async () => {
    const token = 'Forbidden';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateJob returns internal server error', async () => {
    const token = 'Internal Server Error';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobList
test('getJobList returns list with valid strings', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'FilterType');
    expect(res[0]).toEqual({ job_id: 1 });
});

test('getJobList returns list with no params', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token);
    expect(res[0]).toEqual({ job_id: 1 });
});

test('getJobList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Bad Request');
    expect(res.reason).toEqual('Bad Request');
});

test('getJobList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Unauthorized');
    expect(res.reason).toEqual('Unauthorized');
});

test('getJobList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Not Found');
    expect(res.reason).toEqual('Not Found');
});

test('getJobList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Internal Server Error');
    expect(res.reason).toEqual('Internal Server Error');
});

// cloneJob
test('cloneJob returns new job_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, 1);
    expect(res.job_id).toEqual(1);
});

test('cloneJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -1);
    expect(res.reason).toEqual('Bad Request');
});

test('cloneJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('cloneJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -3);
    expect(res.reason).toEqual('Forbidden');
});

test('cloneJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// deleteJob
test('deleteJob returns new job_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, 1);
    expect(res.job_id).toEqual(1);
});

test('deleteJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -1);
    expect(res.reason).toEqual('Bad Request');
});

test('deleteJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('deleteJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -3);
    expect(res.reason).toEqual('Forbidden');
});

test('deleteJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});
