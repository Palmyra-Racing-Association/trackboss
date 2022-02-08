import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${date.getDate().toString().padStart(2, '0')}`;
};

const PROC_SQL = 'CALL sp_patch_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const CHECK_SQL = 'SELECT membership_id, membership_admin_id, status, cur_year_renewed, renewal_sent, year_joined, ' +
    'address, city, state, zip, DATE_FORMAT(membership.last_modified_date, "%Y-%m-%d") AS last_modified_date, ' +
    'last_modified_by FROM membership WHERE membership_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- membership_id
- membership_admin_id
- status
- cur_year_renewed
- renewal_sent
- year_joined
- address
- city
- state
- zip
- modified_by
*/

describe('sp_patch_membership()', () => {
    it('Patches all fields', async () => {
        const membershipId = 1;
        const values = [membershipId, 42, 'Pending', 1, 1, 2022, 'street', 'city', 'state', 'zip', 42];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [membershipId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(values[1]);
        expect(checkResults[0].status).toBe(values[2]);
        expect(checkResults[0].cur_year_renewed[0]).toBe(values[3]);
        expect(checkResults[0].renewal_sent[0]).toBe(values[4]);
        expect(checkResults[0].year_joined).toBe(values[5]);
        expect(checkResults[0].address).toBe(values[6]);
        expect(checkResults[0].city).toBe(values[7]);
        expect(checkResults[0].state).toBe(values[8]);
        expect(checkResults[0].zip).toBe(values[9]);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches membership_admin_id field', async () => {
        const membershipId = 2;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[1] = 24;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(values[1]);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches status field', async () => {
        const membershipId = 3;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[2] = 'Disabled';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(values[2]);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches cur_year_renewed field', async () => {
        const membershipId = 4;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[3] = 1;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(values[3]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches renewal_sent field', async () => {
        const membershipId = 5;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[4] = 1;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(values[4]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches year_joined field', async () => {
        const membershipId = 6;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[5] = 2222;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(values[5]);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches address field', async () => {
        const membershipId = 7;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[6] = 'newAddress';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(values[6]);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches city field', async () => {
        const membershipId = 8;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[7] = 'newCity';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(values[7]);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches state field', async () => {
        const membershipId = 9;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[8] = 'newState';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(values[8]);
        expect(checkResults[0].zip).toBe(origValues[0].zip);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches zip field', async () => {
        const membershipId = 10;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);

        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[9] = 'newZip';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [membershipId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].membership_id).toBe(membershipId);
        expect(checkResults[0].membership_admin_id).toBe(origValues[0].membership_admin_id);
        expect(checkResults[0].status).toBe(origValues[0].status);
        expect(checkResults[0].cur_year_renewed[0]).toBe(origValues[0].cur_year_renewed[0]);
        expect(checkResults[0].renewal_sent[0]).toBe(origValues[0].renewal_sent[0]);
        expect(checkResults[0].year_joined).toBe(origValues[0].year_joined);
        expect(checkResults[0].address).toBe(origValues[0].address);
        expect(checkResults[0].city).toBe(origValues[0].city);
        expect(checkResults[0].state).toBe(origValues[0].state);
        expect(checkResults[0].zip).toBe(values[9]);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Throws on improper user input', async () => {
        const membershipId = 13;
        const values = Array(13).fill(null);
        values[0] = membershipId;
        values[10] = 0;

        await expect(pool.query<OkPacket>(PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without membershipId', async () => {
        const values = Array(13).fill(null);

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when membershipId not found', async () => {
        const values = Array(13).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
