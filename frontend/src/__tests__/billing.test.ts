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
    if ('threshold' in res) {
        expect(res.threshold).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getYearlyThreshold returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getYearlyThreshold(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getYearlyThreshold returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getYearlyThreshold(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getBills
test('getBills returns list', async () => {
    const token = 'TestingToken';
    const res = await getBills(token);
    if ('reason' in res) {
        throw new Error('Received unexpected error response');
    } else {
        expect(Array.isArray(res));
    }
});

test('getBills returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBills returns 403', async () => {
    const token = 'Forbidden';
    const res = await getBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('getBills returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// getBillsForMembership
test('getBillsForMembership returns list', async () => {
    const token = 'TestingToken';
    const res = await getBillsForMembership(token, 1);
    if (Array.isArray(res)) {
        expect(res[0].billId).toEqual(1);
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBillsForMembership returns 401', async () => {
    const token = 'Unauthorized';
    const res = await getBillsForMembership(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBillsForMembership returns 403', async () => {
    const token = 'Forbidden';
    const res = await getBillsForMembership(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('getBillsForMembership returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await getBillsForMembership(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// generateBills
test('generateBills returns valid first item', async () => {
    const token = 'TestingToken';
    const res = await generateBills(token);
    if (Array.isArray(res)) {
        expect(res[0]).toEqual({ billId: 1 });
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('generateBills returns 401', async () => {
    const token = 'Unauthorized';
    const res = await generateBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('generateBills returns 403', async () => {
    const token = 'Forbidden';
    const res = await generateBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected error response');
    }
});

test('generateBills returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await generateBills(token);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

// payBill
test('payBill returns valid status', async () => {
    const token = 'TestingToken';
    const res = await payBill(token, 1);
    if ('reason' in res) {
        throw new Error('Received unexpected error response');
    } else {
        expect(res).toEqual({});
    }
});

test('payBill returns 401', async () => {
    const token = 'Unauthorized';
    const res = await payBill(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Unauthorized');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('payBill returns 403', async () => {
    const token = 'Forbidden';
    const res = await payBill(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Forbidden');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('payBill returns 404', async () => {
    const token = 'Not Found';
    const res = await payBill(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Not Found');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});

test('payBill returns 500', async () => {
    const token = 'Internal Server Error';
    const res = await payBill(token, 1);
    if ('reason' in res) {
        expect(res.reason).toEqual('Internal Server Error');
    } else {
        throw new Error('Received unexpected non-error response');
    }
});
