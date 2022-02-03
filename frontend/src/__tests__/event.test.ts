import {
    createEvent,
    getEvent,
    updateEvent,
    deleteEvent,
    getEventList,
} from '../controller/event';

// createEvent
test('createEvent returns new eventId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            date: '2022-01-27',
            eventTypeId: 0,
            eventName: 'string',
            eventDescription: 'string',
        },
    );
    if ('eventId' in res) {
        expect(res.eventId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createEvent returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            eventName: 'Bad Request',
            eventTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEvent returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            eventName: 'Unauthorized',
            eventTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEvent returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            eventName: 'Forbidden',
            eventTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEvent returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEvent(
        token,
        {
            eventName: 'Internal Server Error',
            eventTypeId: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getEvent
test('getEvent returns Event with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, 1);
    if ('eventId' in res) {
        expect(res.eventId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEvent returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEvent returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEvent returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEvent returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEvent(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateEvent
test('updateEvent returns new eventId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            date: '12/18/21',
            eventName: 'Squeaky Training Wheels Invitational (Rescheduled)',
        },
    );
    if ('eventId' in res) {
        expect(res.eventId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateEvent returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            eventName: 'Bad Request',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEvent returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            eventName: 'Unauthorized',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEvent returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            eventName: 'Forbidden',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEvent returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateEvent(
        token,
        1,
        {
            eventName: 'Internal Server Error',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getEventList
test('getEventList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getEventList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ eventId: 1 });
    } else {
        throw new Error('Received unexpected error message');
    }
});

test('getEventList returns 400', async () => {
    const token = 'Badrequest';
    const res = await getEventList(token, 'Badrequest');
    if ('reason' in res) {
        expect(res.reason).toEqual('Badrequest');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getEventList(token, 'Unauthorized');
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventList returns 404', async () => {
    const token = 'NotFound';
    const res = await getEventList(token, 'NotFound');
    if ('reason' in res) {
        expect(res.reason).toEqual('NotFound');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventList returns 500', async () => {
    const token = 'InternalServerError';
    const res = await getEventList(token, 'InternalServerError');
    if ('reason' in res) {
        expect(res.reason).toEqual('InternalServerError');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// deleteEvent
test('delete event returns valid eventId', async () => {
    const token = 'TestingToken';
    const res = await deleteEvent(token, 1);
    if ('eventId' in res) {
        expect(res.eventId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('deleteEvent returns 400', async () => {
    const token = 'Bad request';
    const res = await deleteEvent(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEvent returns 401', async () => {
    const token = 'Unauthorized';
    const res = await deleteEvent(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEvent returns 404', async () => {
    const token = 'Not Found';
    const res = await deleteEvent(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteEvent returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await deleteEvent(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
