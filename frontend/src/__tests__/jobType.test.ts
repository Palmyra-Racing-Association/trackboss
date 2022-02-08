import {
    createJobType,
    getJobType,
    updateJobType,
    getJobTypeList,
} from '../controller/jobType';

// createJobType
test('createJobType returns new jobTypeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'string',
            pointValue: 0,
            cashValue: 0,
            jobDayNumber: 0,
            reserved: true,
            online: true,
            mealTicket: true,
            sortOrder: 0,
            modifiedBy: 0,
        },
    );
    if ('jobTypeId' in res) {
        expect(res.jobTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Bad Request',
            reserved: false,
            online: false,
            mealTicket: false,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJobType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Unauthorized',
            reserved: false,
            online: false,
            mealTicket: false,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJobType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Forbidden',
            reserved: false,
            online: false,
            mealTicket: false,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJobType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJobType(
        token,
        {
            title: 'Internal Server Error',
            reserved: false,
            online: false,
            mealTicket: false,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getJobType
test('getJobType returns jobType with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, 1);
    if ('jobTypeId' in res) {
        expect(res.jobTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getJobType returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobType returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobType returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobType returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJobType(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateJobType
test('updateJobType returns new jobTypeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'string',
            pointValue: 0,
            cashValue: 0,
            jobDayNumber: 0,
            reserved: true,
            online: true,
            mealTicket: true,
            sortOrder: 0,
            active: true,
            modifiedBy: 0,
        },
    );
    if ('jobTypeId' in res) {
        expect(res.jobTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateJobType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJobType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJobType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJobType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateJobType(
        token,
        1,
        {
            title: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getJobTypeList
test('getJobTypeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getJobTypeList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ jobTypeId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getJobTypeList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getJobTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getMemberList returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getJobTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
