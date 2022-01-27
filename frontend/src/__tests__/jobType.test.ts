import {
    createJobType,
    getJobType,
    updateJobType,
    getJobTypeList,
} from '../controller/jobType';

// createJobType
test('createJobType returns new job_type_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'string',
            point_value: 0,
            cash_value: 0,
            job_day_number: 0,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 0,
            modified_by: 0,
        },
    );
    expect(res.job_type_id).toEqual(1);
});

test('createJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createJobType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createJobType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createJobType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobType
test('getJobType returns jobType with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, 1);
    expect(res.job_type_id).toEqual(1);
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
test('updateJobType returns new job_type_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'string',
            point_value: 0,
            cash_value: 0,
            job_day_number: 0,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 0,
            active: true,
            modified_by: 0,
        },
    );
    expect(res.job_type_id).toEqual(1);
});

test('updateJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'Bad Request',
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
            title: 'Unauthorized',
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
            title: 'Forbidden',
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
            title: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getJobTypeList
test('getJobTypeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getJobTypeList(token);
    expect(res[0]).toEqual({ job_type_id: 1 });
});

test('getJobTypeList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getJobTypeList(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('getMemberList returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getJobTypeList(token);
    expect(res.reason).toEqual('Internal Server Error');
});
