import _ from 'lodash';
import { Bill, GetBillListRequestFilters, WorkPointThreshold } from 'src/typedefs/bill';
import { Membership } from 'src/typedefs/membership';
import * as billing from '../../../database/billing';

export const billList: Bill[] = [
    {
        billId: 0,
        generatedDate: '2022-03-21',
        year: 2022,
        amount: 100,
        amountWithFee: 101,
        membershipAdmin: 'Jimbus Gimbus',
        membershipAdminEmail: 'em@il.com',
        emailedBill: '2022-03-21',
        curYearPaid: true,
    }, {
        billId: 1,
        generatedDate: '2022-03-21',
        year: 2022,
        amount: 100,
        amountWithFee: 101,
        membershipAdmin: 'Rando Mando',
        membershipAdminEmail: 'em@il.com',
        emailedBill: '2022-03-21',
        curYearPaid: false,
    }, {
        billId: 2,
        generatedDate: '2022-03-21',
        year: 2021,
        amount: 100,
        amountWithFee: 101,
        membershipAdmin: 'Jimbus Gimbus',
        membershipAdminEmail: 'em@il.com',
        emailedBill: '2022-03-21',
        curYearPaid: false,
    }, {
        billId: 3,
        generatedDate: '2022-03-21',
        year: 2021,
        amount: 100,
        amountWithFee: 101,
        membershipAdmin: 'Rando Mando',
        membershipAdminEmail: 'em@il.com',
        emailedBill: '2022-03-21',
        curYearPaid: true,
    },
];

export const mockGetBillList = jest
    .spyOn(billing, 'getBillList')
    .mockImplementation((filters: GetBillListRequestFilters): Promise<Bill[]> => {
        let bills: Bill[] = billList;
        const { membershipId, year, paymentStatus } = filters;
        if (typeof membershipId !== 'undefined') {
            let targetAdmin: string;
            if (membershipId === 0) {
                targetAdmin = 'Jimbus Gimbus';
            } else if (membershipId === 1) {
                targetAdmin = 'Rando Mando';
            } else if (membershipId === 500) {
                throw new Error('internal server error');
            } else {
                // shouldn't have any bills
                targetAdmin = 'Philbert Zilbert';
            }
            bills = _.filter(bills, (bill) => bill.membershipAdmin === targetAdmin);
        }
        if (typeof year !== 'undefined') {
            bills = _.filter(bills, (bill) => bill.year === Number(year));
        }
        if (typeof paymentStatus !== 'undefined') {
            switch (paymentStatus) {
                case 'paid':
                    bills = _.filter(bills, (bill) => bill.curYearPaid);
                    break;
                case 'outstanding':
                    bills = _.filter(bills, (bill) => !bill.curYearPaid);
                    break;
                case 'ise':
                    throw new Error('internal server error');
                default:
                    // don't filter
            }
        }
        return Promise.resolve(bills);
    });

export const mockGetThreshold = jest.spyOn(billing, 'getWorkPointThreshold').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((year: number): Promise<WorkPointThreshold> => {
    const curYear = new Date().getFullYear();
    switch (year) {
        case curYear:
            return Promise.resolve({ year: curYear, threshold: 100 });
        case 1976:
            return Promise.resolve({ year: 1976, threshold: 100 });
        default:
            throw new Error('not found');
    }
});

export const mockMarkBillPaid = jest.spyOn(billing, 'markBillPaid').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((id: number): Promise<void> => {
    if (id !== 0) {
        throw new Error('not found');
    }
    return Promise.resolve();
});

export const membershipList: Membership[] = [
    {
        membershipId: 0,
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
    }, {
        membershipId: 1,
        membershipAdmin: 'Gilgo Gabbins',
        status: 'Active',
        curYearRenewed: true,
        renewalSent: true,
        yearJoined: 2022,
        address: 'his house',
        city: 'the shire',
        state: 'uhhh the shire',
        zip: "what's a zip",
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Dangalf',
    }, {
        membershipId: 2,
        membershipAdmin: 'Skykin Anawalker',
        status: 'Active',
        curYearRenewed: true,
        renewalSent: true,
        yearJoined: 2022,
        address: 'right off a lava river',
        city: 'the low ground',
        state: 'mustafar',
        zip: '¯\\_(ツ)_/¯',
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Lurge Geocas',
    },
];
