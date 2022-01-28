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

test('getYearlyThreshold returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Unauthorized');
});


test('getYearlyThreshold returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getYearlyThreshold(token);
    expect(res.reason).toEqual('Internal Server Error');
});

// getBills
test('getBills returns valid status', async () => {
    const token = 'TestingToken';
    const res = await getBills(token);
    expect(res.status).toEqual(200);
});

test('getBills returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getBills(token);
    expect(res.statusText).toEqual('Unauthorized');
});

test('getBills returns 403', async () => {
    const token = 'Forbidden';
    const res = await getBills(token);
    expect(res.statusText).toEqual('Forbidden');
});

test('getBills returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getBills(token);
    expect(res.statusText).toEqual('Internal Server Error');
});

// getBillsForMembership
test('getBillsForMembership returns valid bill id', async () => {
    const token = 'TestingToken';
    const res = await getBillsForMembership(token, 1);
    expect(res.bill_id).toEqual(1);
});

test('getBillsForMembership returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getBillsForMembership(token, 1);
    expect(res.reason).toEqual('Unauthorized');
});

test('getBillsForMembership returns 403', async () => {
    const token = 'Forbidden';
    const res = await getBillsForMembership(token, 1);
    expect(res.reason).toEqual('Forbidden');
});

test('getBillsForMembership returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getBillsForMembership(token, 1);
    expect(res.reason).toEqual('Internal Server Error');
});

// generateBills
test('generateBills returns valid first item', async () => {
    const token = 'TestingToken';
    const res = await generateBills(token);
    expect(res[0]).toEqual({ bill_id: 1, });
});

test('generateBills returns 401', async () => {
    const token = 'Unauthorized';
    const res = await generateBills(token);
    expect(res.reason).toEqual('Unauthorized');
});

test('generateBills returns 403', async () => {
    const token = 'Forbidden';
    const res = await generateBills(token);
    expect(res.reason).toEqual('Forbidden');
});

test('generateBills returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await generateBills(token);
    expect(res.reason).toEqual('Internal Server Error');
});

// payBill
test('payBill returns valid status', async () => {
    const token = 'TestingToken';
    const res = await payBill(token, 1);
    expect(res.status).toEqual(200);
});

test('payBill returns 401', async () => {
    const token = 'Unauthorized';
    const res = await payBill(token, 1);
    expect(res.statusText).toEqual('Unauthorized');
});

test('payBill returns 403', async () => {
    const token = 'Forbidden';
    const res = await payBill(token, 1);
    expect(res.statusText).toEqual('Forbidden');
});

test('payBill returns 404', async () => {
    const token = 'Not Found';
    const res = await payBill(token, 1);
    expect(res.statusText).toEqual('Not Found');
});

test('payBill returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await payBill(token, 1);
    expect(res.statusText).toEqual('Internal Server Error');
});
