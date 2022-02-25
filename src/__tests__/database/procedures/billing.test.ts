import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const PROC_SQL = 'CALL sp_patch_bill(?, ?, ?)';
const CHECK_SQL = 'SELECT bill_id, DATE_FORMAT(mb.generated_date, "%Y-%m-%d") AS generated_date, year, amount, ' +
    'amount_with_fee, membership_id, emailed_bill, cur_year_paid FROM member_bill mb WHERE bill_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- bill_id,
- emailed_bill,
- cur_year_paid,
*/

describe('sp_patch_bill()', () => {
    it('Patches all fields', async () => {
        const billId = 1;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [billId]);

        const values = [billId, '2022-02-24', 1];

        expResults[0].emailed_bill = '2022-02-24';
        expResults[0].cur_year_paid = [1];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [billId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults));
    });

    it('Patches emailed_bill field', async () => {
        const billId = 2;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [billId]);

        const values = [billId, '1900-01-02', null];

        expResults[0].emailed_bill = '1900-01-02';

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [billId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches cur_year_paid field', async () => {
        const billId = 3;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [billId]);

        const values = [billId, null, 0];

        expResults[0].cur_year_paid = 0;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [billId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Throws on improper user input', async () => {
        const billId = 4;
        const values = Array(5).fill(null);
        values[0] = billId;
        values[1] = 'notADoubleOrEvenANumberAtAll';

        await expect(pool.query<OkPacket>(PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without billId', async () => {
        const values = Array(3).fill(null);

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when billId not found', async () => {
        const values = Array(3).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
