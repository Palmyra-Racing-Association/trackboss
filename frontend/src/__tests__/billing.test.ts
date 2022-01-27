import {
    getYearlyThreshold,
    getBills,
    getBillsForMembership,
    generateBills,
    payBill,
} from '../controller/billing';

// getYearlyThreshold
test('getYearlyThreshold returns valid threshold', async () => {
    const token = 'TestingToken';
    const res = await getYearlyThreshold(token);
    expect(res.threshold).toEqual(1);
});

test('getYearlyThreshold returns 400', async () => {
    const token = 'Bad request';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Bad request');
});

test('getYearlyThreshold returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('getYearlyThreshold returns 404', async () => {
    const token = 'Not Found';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Not Found');
});

test('getYearlyThreshold returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Internal Server Error');
});

