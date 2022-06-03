import { format } from 'date-fns';
import { Bill } from '../../typedefs/bill';
import { WorkPoints } from '../../typedefs/workPoints';
import { mockEmailBills, mockGenerateNewBills, mockGetBillList } from '../api/mocks/billing';
import { generateNewBills, emailBills } from '../../util/billing';
import * as billing from '../../database/billing';
import * as membership from '../../database/membership';
import * as workPoints from '../../database/workPoints';

export const mockGenerateBill = jest.spyOn(billing, 'generateBill').mockImplementation();

export const mockMarkBillEmailed = jest.spyOn(billing, 'markBillEmailed').mockImplementation();

beforeAll(() => {
    mockGenerateNewBills.mockRestore();
    mockEmailBills.mockRestore();
});

describe('generateNewBills()', () => {
    it('Calculates nonzero bill amount and fee correctly', async () => {
        const membershipId = 0;
        const membershipList = [{
            membershipId,
            membershipAdmin: 'Criminy Jicket',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: 'the ground',
            city: 'or wherever',
            state: 'jickets',
            zip: 'live',
            lastModifiedDate: '2022-03-09',
            lastModifiedBy: 'Nipocchio',
        }];
        const preGeneratedBills: Bill[] = [];
        const year = new Date().getFullYear();
        const threshold = 100;
        const baseDues = 1000;
        const earned = 25;
        const expOwed = 750;
        // based on (owed * 1.0290) + 0.30 which is paypal's standard calc.
        const expOwedWithFee = 772.05;

        const mockGetBaseDues = jest
            .spyOn(membership, 'getBaseDues')
            .mockImplementation(async (): Promise<number> => baseDues);
        const mockGetWorkPointsByMembership = jest
            .spyOn(workPoints, 'getWorkPointsByMembership')
            .mockImplementation(async (): Promise<WorkPoints> => ({ total: earned }));

        // ignore the output from generateNewBills because mockGetBillList will
        // return an inaccurate list
        await generateNewBills(membershipList, preGeneratedBills, threshold, year);
        expect(mockGetBaseDues).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(mockGenerateBill).toHaveBeenCalledWith({
            amount: expOwed,
            amountWithFee: expOwedWithFee,
            membershipId,
        });
        expect(mockGetBillList).toHaveBeenCalled();
    });

    it('Calculates paid-off bill amount and fee correctly', async () => {
        const membershipId = 0;
        const membershipList = [{
            membershipId,
            membershipAdmin: 'Criminy Jicket',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: 'the ground',
            city: 'or wherever',
            state: 'jickets',
            zip: 'live',
            lastModifiedDate: '2022-03-09',
            lastModifiedBy: 'Nipocchio',
        }];
        const preGeneratedBills: Bill[] = [];
        const year = new Date().getFullYear();
        const threshold = 100;
        const baseDues = 1000;
        const earned = 125;
        const expOwed = 0;
        const expOwedWithFee = 0; // TODO: change if fee is added

        const mockGetBaseDues = jest
            .spyOn(membership, 'getBaseDues')
            .mockImplementation(async (): Promise<number> => baseDues);
        const mockGetWorkPointsByMembership = jest
            .spyOn(workPoints, 'getWorkPointsByMembership')
            .mockImplementation(async (): Promise<WorkPoints> => ({ total: earned }));

        // ignore the output from generateNewBills because mockGetBillList will
        // return an inaccurate list
        await generateNewBills(membershipList, preGeneratedBills, threshold, year);
        expect(mockGetBaseDues).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(mockGenerateBill).toHaveBeenCalledWith({
            amount: expOwed,
            amountWithFee: expOwedWithFee,
            membershipId,
            pointsEarned: 125,
            pointsThreshold: 100,
        });
        expect(mockGetBillList).toHaveBeenCalled();
    });

    it('Does not generate duplicate bills', async () => {
        const membershipList = [{
            membershipId: 0,
            membershipAdmin: 'Jimbus Gimbus',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: '...',
            city: '...',
            state: '...',
            zip: '...',
            lastModifiedDate: '...',
            lastModifiedBy: '...',
        }, {
            membershipId: 1,
            membershipAdmin: 'Rando Mando',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: '...',
            city: '...',
            state: '...',
            zip: '...',
            lastModifiedDate: '...',
            lastModifiedBy: '...',
        }];
        const preGeneratedBills: Bill[] = [{
            billId: 1,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Rando Mando',
            membershipAdminEmail: 'em@il.com',
            emailedBill: '2022-03-21',
            curYearPaid: false,
            pointsEarned: 0,
            pointsThreshold: 0,
            dueDate: new Date().toDateString(),
        }];
        const year = new Date().getFullYear();
        const threshold = 100;
        const baseDues = 1000;
        const earned = 125;

        const mockGetBaseDues = jest
            .spyOn(membership, 'getBaseDues')
            .mockImplementation(async (): Promise<number> => baseDues);
        const mockGetWorkPointsByMembership = jest
            .spyOn(workPoints, 'getWorkPointsByMembership')
            .mockImplementation(async (): Promise<WorkPoints> => ({ total: earned }));

        const results = await generateNewBills(membershipList, preGeneratedBills, threshold, year);
        expect(mockGetBaseDues).toHaveBeenCalled();
        expect(mockGetWorkPointsByMembership).toHaveBeenCalled();
        expect(mockGenerateBill).toHaveBeenCalledTimes(1);
        expect(mockGetBillList).toHaveBeenCalled();
        expect(results.length).toBe(1);
        expect(results[0].membershipAdmin).toBe('Jimbus Gimbus');
    });

    it('Does not short-circuit upon bill generation error', async () => {
        const membershipList = [{
            membershipId: 0,
            membershipAdmin: 'Jimbus Gimbus',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: '...',
            city: '...',
            state: '...',
            zip: '...',
            lastModifiedDate: '...',
            lastModifiedBy: '...',
        }, {
            membershipId: 1,
            membershipAdmin: 'Rando Mando',
            status: 'Active',
            curYearRenewed: true,
            renewalSent: true,
            yearJoined: 2022,
            address: '...',
            city: '...',
            state: '...',
            zip: '...',
            lastModifiedDate: '...',
            lastModifiedBy: '...',
        }];
        const preGeneratedBills: Bill[] = [];
        const year = new Date().getFullYear();
        const threshold = 100;
        const baseDues = 1000;
        const earned = 125;

        const mockGetBaseDues = jest
            .spyOn(membership, 'getBaseDues')
            .mockImplementationOnce(() => { throw new Error('intentional test design'); })
            .mockImplementation(async (): Promise<number> => baseDues);
        const mockGetWorkPointsByMembership = jest
            .spyOn(workPoints, 'getWorkPointsByMembership')
            .mockImplementation(async (): Promise<WorkPoints> => ({ total: earned }));

        // ignore the output from generateNewBills because mockGetBillList will
        // return an inaccurate list
        await generateNewBills(membershipList, preGeneratedBills, threshold, year);
        // track passage through the loop by counting mock calls
        expect(mockGetBaseDues).toHaveBeenCalledTimes(2);
        // these should only be called the second time through
        expect(mockGetWorkPointsByMembership).toHaveBeenCalledTimes(1);
        expect(mockGenerateBill).toHaveBeenCalledTimes(1);
        expect(mockGetBillList).toHaveBeenCalled();
    });
});

// TODO: un-skip this when emailing bills is implemented
describe.skip('emailBills()', () => {
    it('Emails bills correctly', async () => {
        const generatedBills = [{
            billId: 0,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Jimbus Gimbus',
            membershipAdminEmail: 'em@il.com',
            emailedBill: undefined,
            curYearPaid: true,
        }];
        const today = format(new Date(), 'yyyy-MM-dd');

        // TODO: probably gonna need additional mock(s) here
        const results = await emailBills(generatedBills);
        expect(mockMarkBillEmailed).toHaveBeenCalled();
        expect(results[0].emailedBill).toBe(today);
    });

    it('Does not send duplicate emails', async () => {
        const generatedBills = [{
            billId: 0,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Jimbus Gimbus',
            membershipAdminEmail: 'em@il.com',
            emailedBill: '2022-03-21',
            curYearPaid: true,
            pointsEarned: 0,
            threshold: 0,
        }];

        // TODO: probably gonna need additional mock(s) here
        const results = await emailBills(generatedBills);
        expect(mockMarkBillEmailed).not.toHaveBeenCalled();
        expect(results[0].emailedBill).toBe('2022-03-21');
    });

    it('Does not short-circuit upon email send error', async () => {
        const generatedBills = [{
            billId: 0,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Jimbus Gimbus',
            membershipAdminEmail: 'em@il.com',
            emailedBill: undefined,
            curYearPaid: true,
        }, {
            billId: 1,
            generatedDate: '2022-03-21',
            year: 2022,
            amount: 100,
            amountWithFee: 101,
            membershipAdmin: 'Rando Mando',
            membershipAdminEmail: 'em@il.com',
            emailedBill: undefined,
            curYearPaid: false,
            pointsEarned: 0,
            threshold: 0,
        }];
        const today = format(new Date(), 'yyyy-MM-dd');

        // TODO: make a mock that throws error the first time and works the second
        // (see the generateNewBills() no-short-circuit test)
        const results = await emailBills(generatedBills);
        // TODO: expect that mock to be called twice

        // this should only be called the second time through
        expect(mockMarkBillEmailed).toHaveBeenCalledTimes(1);
        expect(results[0].emailedBill).toBeUndefined();
        expect(results[1].emailedBill).toBe(today);
    });
});
