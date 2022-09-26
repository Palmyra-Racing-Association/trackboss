export function getBillListResponse(values: (string | number)[]): Promise<any[]> {
    const billList = [
        {
            bill_id: 18,
            generated_date: '2021-02-24',
            year: 2021,
            amount: 199.99,
            amount_with_fee: 209.99,
            membership_admin: 'Jimbo Wimbo',
            membership_admin_email: 'em@il.com',
            emailed_bill: null,
            cur_year_paid: [0],
            cur_year_ins: [0],
        }, {
            bill_id: 19,
            generated_date: '2022-02-24',
            year: 2022,
            amount: 199.99,
            amount_with_fee: 209.99,
            membership_admin: 'Joe Bro',
            membership_admin_email: 'em@il.com',
            emailed_bill: null,
            cur_year_paid: [0],
            cur_year_ins: [0],
        }, {
            bill_id: 20,
            generated_date: '2022-02-24',
            year: 2022,
            amount: 199.99,
            amount_with_fee: 209.99,
            membership_admin: 'Jimbo Wimbo',
            membership_admin_email: 'em@il.com',
            emailed_bill: null,
            cur_year_paid: [1],
            cur_year_ins: [0],
        }, {
            bill_id: 21,
            generated_date: '2021-02-24',
            year: 2021,
            amount: 199.99,
            amount_with_fee: 209.99,
            membership_admin: 'Joe Bro',
            membership_admin_email: 'em@il.com',
            emailed_bill: null,
            cur_year_paid: [1],
            cur_year_ins: [0],
        },
    ];
    if (values.length === 0) {
        return Promise.resolve([billList]);
    }
    switch (values[0]) {
        case -100:
            throw new Error('error message');
        case 1:
            return Promise.resolve([billList.filter((bill) => bill.membership_admin === 'Joe Blow')]);
        case 2022:
            return Promise.resolve([billList.filter((bill) => bill.year === 2022)]);
        case 'outstanding':
            return Promise.resolve([billList.filter((bill) => bill.cur_year_paid[0] === 0)]);
        case 'paid':
            return Promise.resolve([billList.filter((bill) => bill.cur_year_paid[0] === 1)]);
        default:
            throw new Error('reached unexpected case in mock');
    }
}

export function getWorkPointThresholdResponse(year: number): Promise<any[][]> {
    switch (year) {
        case 2022:
            return Promise.resolve([[{
                year: 2022,
                amount: 42,
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            throw new Error('reached unexpected case in mock');
    }
}

export function generateBillResponse(amount: number): Promise<any[]> {
    switch (amount) {
        case 42:
            return Promise.resolve([{ insertId: 321 }]);
        case -100:
            throw new Error('error message');
        default:
            throw new Error('reached unexpected case in mock');
    }
}

export function patchBillResponse(id: number): Promise<any[]> {
    switch (id) {
        case 42:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 3000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case -100:
            throw new Error('error message');
        default:
            throw new Error('reached unexpected case in mock');
    }
}
