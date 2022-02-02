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
    expect(res.event_jobId).toEqual(1);
});

test('createEventJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -1,
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateEventJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -2,
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createEventJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -3,
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createEventJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEventJob(
        token,
        {
            eventTypeId: -4,
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getEventJob
test('getEventJob returns eventJob with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, 1);
    expect(res.eventTypeId).toEqual(1);
});

test('getEventJob returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getEventJob returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getEventJob returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getEventJob returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEventJob(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
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
    expect(res.eventTypeId).toEqual(1);
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
    expect(res.reason).toEqual('Bad Request');
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
    expect(res.reason).toEqual('Unauthorized');
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
    expect(res.reason).toEqual('Forbidden');
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
    expect(res.reason).toEqual('Not Found');
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
    expect(res.reason).toEqual('Internal Server Error');
});

// deleteEventJob
test('deleteEventJob returns valid event_jobId', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, 1);
    expect(res.eventTypeId).toEqual(1);
});

test('deleteEventJob returns bad request', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -1);
    expect(res.reason).toEqual('Bad Request');
});

test('deleteEventJob returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('deleteEventJob returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -3);
    expect(res.reason).toEqual('Forbidden');
});

test('deleteEventJob returns not found', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -4);
    expect(res.reason).toEqual('Not Found');
});

test('deleteEventJob returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await deleteEventJob(token, -5);
    expect(res.reason).toEqual('Internal Server Error');
});
