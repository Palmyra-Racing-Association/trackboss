import {
    createEventType,
    getEventType,
    updateEventType,
    getEventTypeList,
} from '../controller/eventType';

// createEventType
test('createEventType returns new eventTypeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'string',
            modified_by: 0,
        },
    );
    expect(res.eventTypeId).toEqual(1);
});

test('createEventType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateEventType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createEventType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createEventType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getEventTypeList
test('getEventTypeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getEventTypeList(token);
    expect(res[0]).toEqual({ eventTypeId: 1 });
});

test('getEventTypeList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getEventTypeList(token);
    expect(res[0]).toEqual({ eventTypeId: 1 });
});

test('getEventTypeList returns 400', async () => {
    const token = 'Bad request';
    const res = await getEventTypeList(token);
    expect(res.reason).toEqual('Bad request');
});

test('getEventTypeList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getEventTypeList(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('getEventTypeList returns 404', async () => {
    const token = 'Not Found';
    const res = await getEventTypeList(token);
    expect(res.reason).toEqual('Not Found');
});

test('getEventTypeList returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getEventTypeList(token);
    expect(res.reason).toEqual('Internal Server Error');
});

// getEventType
test('getEventType returns EventType with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, 1);
    expect(res.eventTypeId).toEqual(1);
});

test('getEventType returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getEventType returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getEventType returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getEventType returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateEventType
test('updateEventType returns new eventTypeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: '1234 New type Street',
            modified_by: 0,
        },
    );
    expect(res.eventTypeId).toEqual(1);
});

test('updateEventType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateEventType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateEventType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateEventType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});
