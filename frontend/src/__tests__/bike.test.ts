import {
    createBike,
    getBikeList,
    getBike,
    updateBike,
    deleteBike,
} from '../controller/bike';

// createBike
test('createBike returns new bike_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'string',
            make: 'string',
            model: 'string',
            membership_id: 0,
        },
    );
    expect(res.bike_id).toEqual(1);
});

test('createBike returns bad request', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Bad Request',
        },
    );
    expect(res.reason).toEqual('Bad Request');
});

test('createBike returns unauthorized', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Unauthorized',
        },
    );
    expect(res.reason).toEqual('Unauthorized');
});

test('createBike returns forbidden', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Forbidden',
        },
    );
    expect(res.reason).toEqual('Forbidden');
});

test('createBike returns internal server error', async () => {
    const token = 'TestingToken';
    const res = await createBike(
        token,
        {
            year: 'Internal Server Error',
        },
    );
    expect(res.reason).toEqual('Internal Server Error');
});

// getBike
test('getBike returns bike_id with valid id', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, 1);
    expect(res.bike_id).toEqual(1);
});

test('getBike returns 400', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('getBike returns 401', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getBike returns 404', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('getBike returns 500', async () => {
    const token = 'TestingToken';
    const res = await getBike(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});

// updateBike
test('updateBike returns new member_id with valid data', async () => {
    const token = 'TestingToken';
    const res = await updateBike(
        token,
        1,
        {
            year: 'string',
            make: 'string',
            model: 'string',
            membership_id: 0,
        },
    );
    expect(res.bike_id).toEqual(1);
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
    expect(res.reason).toEqual('Bad Request');
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
    expect(res.reason).toEqual('Unauthorized');
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
    expect(res.reason).toEqual('Forbidden');
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
    expect(res.reason).toEqual('Internal Server Error');
});

// getBikeList
test('getBikeList returns list with valid id and no query param', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token);
    expect(res[0]).toEqual({ bike_id: 1 });
});

test('getBikeList returns list with valid id and query param', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, 1);
    expect(res[0]).toEqual({ bike_id: 1 });
});

test('getBikeList returns 400', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -1);
    expect(res.reason).toEqual('Badrequest');
});

test('getBikeList returns 401', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('getBikeList returns 404', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -3);
    expect(res.reason).toEqual('NotFound');
});

test('getBikeList returns 500', async () => {
    const token = 'TestingToken';
    const res = await getBikeList(token, -4);
    expect(res.reason).toEqual('InternalServerError');
});

// deleteBike
test('deleteBike returns bike_id with valid id', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, 1);
    expect(res.bike_id).toEqual(1);
});

test('deleteBike returns 400', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -1);
    expect(res.reason).toEqual('Bad request');
});

test('deleteBike returns 401', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -2);
    expect(res.reason).toEqual('Unauthorized');
});

test('deleteBike returns 404', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -3);
    expect(res.reason).toEqual('Not Found');
});

test('deleteBike returns 500', async () => {
    const token = 'TestingToken';
    const res = await deleteBike(token, -4);
    expect(res.reason).toEqual('Internal Server Error');
});
