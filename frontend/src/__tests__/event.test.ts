import {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventList,
} from '../controller/event';

// createEvent
test('createEvent returns new event_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            date: '2022-01-27',
            event_type_id: 0,
            event_name: 'string',
            event_description: 'string',
        },
    );
    expect(res.event_id).toEqual(1);
});

test('createEvent returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createEvent returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createEvent returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createEvent returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getEvent
test('getEvent returns Event with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, 1);
    expect(res.event_id).toEqual(1);
});

test('getEvent returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getEvent returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getEvent returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getEvent returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateEvent
test('updateEvent returns new event_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            date: '12/18/21',
            event_name: 'Squeaky Training Wheels Invitational (Rescheduled)',
        },
    );
    expect(res.event_id).toEqual(1);
});

test('updateEvent returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            address: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('updateEvent returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            address: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('updateEvent returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            address: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('updateEvent returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            address: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getEventList
test('getEventList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getEventList(token);
    expect(res[0]).toEqual({ event_id: 1 });
});

test('getEventList returns 400', async () => {
    const token = 'Badrequest';
    const res = await getEventList(token, 'Badrequest');
    expect(res.reason).toEqual('Badrequest');
});

test('getEventList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getEventList(token, 'Unauthorized');
    expect(res.reason).toEqual('Unauthorized');
});

test('getEventList returns 404', async () => {
    const token = 'NotFound';
    const res = await getEventList(token, 'NotFound');
    expect(res.reason).toEqual('NotFound');
});

test('getEventList returns 500', async () => {
    const token = 'InternalServerError';
    const res = await getEventList(token, 'InternalServerError');
    expect(res.reason).toEqual('InternalServerError');
});

// deleteEvent
test('delete event returns valid event_id', async () => {
    const token = 'TestingToken';
    const res = await deleteEvent(token, 1);
    expect(res.event_id).toEqual(1);
});

test('deleteEvent returns 400', async () => {
    const token = 'Bad request';
    const res = await deleteEvent(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('deleteEvent returns 401', async () => {
    const token = 'Unauthorized';
    const res = await deleteEvent(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('deleteEvent returns 404', async () => {
    const token = 'Not Found';
    const res = await deleteEvent(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('deleteEvent returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await deleteEvent(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});
