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
            modifiedBy: 0,
        },
    );
    if ('eventTypeId' in res) {
        expect(res.eventTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createEventType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEventType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createEventType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createEventType(
        token,
        {
            type: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getEventTypeList
test('getEventTypeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getEventTypeList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ eventTypeId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEventTypeList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getEventTypeList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ eventTypeId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEventTypeList returns 400', async () => {
    const token = 'Bad request';
    const res = await getEventTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventTypeList returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getEventTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventTypeList returns 404', async () => {
    const token = 'Not Found';
    const res = await getEventTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventTypeList returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getEventTypeList(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getEventType
test('getEventType returns EventType with valid id', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, 1);
    if ('eventTypeId' in res) {
        expect(res.eventTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getEventType returns 400', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventType returns 401', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventType returns 404', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getEventType returns 500', async () => {
    const token = 'TestingToken';
    const res = await getEventType(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateEventType
test('updateEventType returns new eventTypeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: '1234 New type Street',
            modifiedBy: 0,
        },
    );
    if ('eventTypeId' in res) {
        expect(res.eventTypeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateEventType returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Bad Request',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventType returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Unauthorized',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventType returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Forbidden',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateEventType returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateEventType(
        token,
        1,
        {
            type: 'Internal Server Error',
            modifiedBy: 0,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
