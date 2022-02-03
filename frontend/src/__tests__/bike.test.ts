import {
    createBike,
    getBikeList,
    getBike,
    updateBike,
    deleteBike,
} from '../controller/bike';

// createBike
test('createBike returns new bikeId with valid data', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'string',
            make: 'string',
            model: 'string',
            membershipId: 0,
        },
    );

    if ('bikeId' in res) {
        expect(res.bikeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('createBike returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Bad Request',
            membershipId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createBike returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Unauthorized',
            membershipId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createBike returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Forbidden',
            membershipId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('createBike returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Internal Server Error',
            membershipId: 1,
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getBike
test('getBike returns bikeId with valid id', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, 1);
    if ('bikeId' in res) {
        expect(res.bikeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBike returns 400', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBike returns 401', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBike returns 404', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBike returns 500', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// updateBike
test('updateBike returns new memberId with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'string',
            make: 'string',
            model: 'string',
            membershipId: 0,
        },
    );
    if ('bikeId' in res) {
        expect(res.bikeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('updateBike returns bad request', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'Bad Request',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad Request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateBike returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'Unauthorized',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateBike returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'Forbidden',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('updateBike returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'Internal Server Error',
        },
    );
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getBikeList
test('getBikeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ bikeId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBikeList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, 1);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ bikeId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBikeList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBikeList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBikeList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBikeList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// deleteBike
test('deleteBike returns bikeId with valid id', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, 1);
    if ('bikeId' in res) {
        expect(res.bikeId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('deleteBike returns 400', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Bad request');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteBike returns 401', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -2);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteBike returns 404', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -3);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('deleteBike returns 500', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -4);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
