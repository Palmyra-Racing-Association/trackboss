import {
    createJob,
    getJob,
    updateJob,
    getJobList,
    cloneJob,
    deleteJob,
} from '../controller/job';

// createJob
test('createJob returns new jobId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            memberId: 0,
            eventId: 0,
            jobTypeId: 0,
            jobDate: '2022-01-27',
            pointsAwarded: 0,
            modifiedBy: 0,
        },
    );
    if ('jobId' in res) {
        expect(res.jobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            jobDate: 'Bad Request',
            jobTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            jobDate: 'Unauthorized',
            jobTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            jobDate: 'Forbidden',
            jobTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createJob(
        token,
        {
            jobDate: 'Internal Server Error',
            jobTypeId: 0,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getJob
test('getJob returns job with valid id', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, 1);
    if ('jobId' in res) {
        expect(res.jobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getJob returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJob returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJob returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJob returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJob(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateJob
test('updateJob returns new jobId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
            modifiedBy: 0,
        },
    );
    if ('jobId' in res) {
        expect(res.jobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateJob returns bad request', async () => {
    const token = 'Bad Request';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJob returns unauthorized', async () => {
    const token = 'Unauthorized';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJob returns forbidden', async () => {
    const token = 'Forbidden';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateJob returns internal server error', async () => {
    const token = 'Internal Server Error';
    const res = await updateJob(
        token,
        1,
        {
            verified: true,
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getJobList
test('getJobList returns list with valid strings', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'FilterType');
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ jobId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getJobList returns list with no params', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ jobId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getJobList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Bad Request');
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Unauthorized');
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Not Found');
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getJobList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getJobList(token, 'queryType', 'Internal Server Error');
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// cloneJob
test('cloneJob returns new jobId with valid data', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, 1);
    if ('jobId' in res) {
        expect(res.jobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('cloneJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('cloneJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('cloneJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('cloneJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await cloneJob(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// deleteJob
test('deleteJob returns new jobId with valid data', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, 1);
    if ('jobId' in res) {
        expect(res.jobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('deleteJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await deleteJob(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
