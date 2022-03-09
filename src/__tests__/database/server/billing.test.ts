import 'dotenv/config';
import _ from 'lodash';

import { Bill, GetBillListRequestFilters } from 'src/typedefs/bill';
import {
    getBillList,
    generateBill,
    getWorkPointThreshold,
    markBillEmailed,
    markBillPaid,
} from '../../../database/billing';
import { mockQuery } from './mockQuery';

describe('generateBill()', () => {
    it('Generates a single bill', async () => {
        const request = { amount: 42, amountWithFee: 1, membershipId: 1 };

        const result = await generateBill(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { amount: -100, amountWithFee: 1, membershipId: 1 };

        await expect(generateBill(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getBillList()', () => {
    const testGetFilteredBillList = async (
        filters: GetBillListRequestFilters,
        assertion: (result: Bill) => void,
    ) => {
        const results = await getBillList(filters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach(assertion);
    };

    it('Returns an unfiltered list of bills', async () => {
        const results = await getBillList({});
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of bills by membership', async () => {
        await testGetFilteredBillList({ membershipId: 1 }, (result) => {
            expect(result.membershipAdmin).toBe('Joe Bro');
        });
    });

    it('Returns a filtered list of bills by year', async () => {
        await testGetFilteredBillList({ year: 2022 }, (result) => {
            expect(result.year).toBe(2022);
        });
    });

    it('Returns a filtered list of bills by outstanding status', async () => {
        await testGetFilteredBillList({ paymentStatus: 'outstanding' }, (result) => {
            expect(!result.curYearPaid);
        });
    });

    it('Returns a filtered list of bills by paid status', async () => {
        await testGetFilteredBillList({ paymentStatus: 'paid' }, (result) => {
            expect(result.curYearPaid);
        });
    });

    it('Throws for internal server error', async () => {
        await expect(getBillList({ membershipId: -100 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getWorkPointThreshold()', () => {
    it('Selects a single threshold', async () => {
        const year = 2022;
        const expBill = {
            year,
            threshold: 42,
        };

        const result = await getWorkPointThreshold(year);
        expect(mockQuery).toHaveBeenCalled();
        expect(_.isEqual(result, expBill));
    });

    it('Throws for year not found', async () => {
        const year = 765;
        await expect(getWorkPointThreshold(year)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const year = -100;
        await expect(getWorkPointThreshold(year)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('markBillEmailed()', () => {
    it('Marks a bill as emailed', async () => {
        const billId = 42;
        // no error means success
        await markBillEmailed(billId);
    });

    it('Throws for bill not found', async () => {
        const billId = 3000;
        await expect(markBillEmailed(billId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const billId = -100;
        await expect(markBillEmailed(billId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('markBillPaid()', () => {
    it('Marks a bill as emailed', async () => {
        const billId = 42;
        // no error means success
        await markBillPaid(billId);
    });

    it('Throws for bill not found', async () => {
        const billId = 3000;
        await expect(markBillPaid(billId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const billId = -100;
        await expect(markBillPaid(billId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
