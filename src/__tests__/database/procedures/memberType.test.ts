import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const PROC_SQL = 'CALL sp_patch_member_type(?, ?, ?)';
const CHECK_SQL = 'SELECT member_type_id, type, base_dues_amt FROM member_types WHERE member_type_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- member_type_id,
- type,
- base_dues_amt,
*/

describe('sp_patch_member_type()', () => {
    it('Patches all fields', async () => {
        const memberTypeId = 1;
        const values = [memberTypeId, 'memberType', 499.99];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [memberTypeId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_type_id).toBe(memberTypeId);
        expect(checkResults[0].type).toBe(values[1]);
        expect(checkResults[0].base_dues_amt).toBe(values[2]);
    });

    it('Patches type field', async () => {
        const memberTypeId = 2;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberTypeId]);

        const values = Array(3).fill(null);
        values[0] = memberTypeId;
        values[1] = 'newMemberType';

        expResults[0].type = 'newMemberType';

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(expResults[0]);
    });

    it('Patches base_dues_amt field', async () => {
        const memberTypeId = 3;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberTypeId]);

        const values = Array(3).fill(null);
        values[0] = memberTypeId;
        values[2] = 214.10;

        expResults[0].base_dues_amt = 214.10;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(expResults[0]);
    });

    it('Throws on improper user input', async () => {
        const memberTypeId = 4;
        const values = Array(3).fill(null);
        values[0] = memberTypeId;
        values[2] = 'thisIsNotAFloat';

        await expect(pool.query<OkPacket>(PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without memberTypeId', async () => {
        const values = Array(3).fill(null);

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when memberTypeId not found', async () => {
        const values = Array(3).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
