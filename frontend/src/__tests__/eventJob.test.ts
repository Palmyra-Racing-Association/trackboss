import {
    createEventJob,
    getEventJob,
    updateEventJob,
    deleteEventJob,
} from '../controller/eventJob';

// createEventJob
test('createEventJob returns new eventJob with valid data', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: 1,
            jobTypeId: 0,
            count: 0,
        },
    );
    if ('eventJobId' in res) {
        expect(res.eventJobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createEventJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -1,
            jobTypeId: 0,
            count: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEventJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -2,
            jobTypeId: 0,
            count: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEventJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -3,
            jobTypeId: 0,
            count: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEventJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -4,
            jobTypeId: 0,
            count: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getEventJob
test('getEventJob returns eventJob with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, 1);
    if ('eventJobId' in res) {
        expect(res.eventJobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEventJob returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventJob returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventJob returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventJob returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateEventJob
test('updateEventJob returns new eventJob with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        1,
        {
            eventTypeId: 1,
        },
    );
    if ('eventJobId' in res) {
        expect(res.eventJobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateEventJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        -1,
        {
            eventTypeId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        -2,
        {
            eventTypeId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        -3,
        {
            eventTypeId: 3,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventJob returns not found', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        -4,
        {
            eventTypeId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateEventJob(
        token,
        -5,
        {
            eventTypeId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// deleteEventJob
test('deleteEventJob returns valid eventJobId', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, 1);
    if ('eventJobId' in res) {
        expect(res.eventJobId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('deleteEventJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEventJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEventJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEventJob returns not found', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEventJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -5);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
