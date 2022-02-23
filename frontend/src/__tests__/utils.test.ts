import * as utilFunctions from '../controller/utils';

test('generateHeaders returns headers', async () => {
    const token = 'TestingToken';
    const headers: Headers = utilFunctions.generateHeaders(token);
    expect(headers).toEqual(new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    }));
});

test('generateHeaders returns headers with range', async () => {
    const token: string = 'TestingToken';
    const inputRange: string = 'someString';
    const headers: Headers = utilFunctions.generateHeaders(token, inputRange);
    const testHeaders = new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        range: `${inputRange}`,
    });
    expect(headers).toEqual(testHeaders);
});
