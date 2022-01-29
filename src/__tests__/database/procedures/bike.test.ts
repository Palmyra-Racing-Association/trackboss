import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config.d';

const pool = mysql.createPool(config);

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_bike() works properly', () => {
    test('Patches all fields', async () => {
        // Original: 40, 2010, Honda, TT-R230, 48
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [40, '9999', 'Burger King', 'Chicken Fry', 49];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [values[0]];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(values[0]);
        expect(checkResults[0].year).toBe(values[1]);
        expect(checkResults[0].make).toBe(values[2]);
        expect(checkResults[0].model).toBe(values[3]);
        expect(checkResults[0].membership_id).toBe(values[4]);
    });
});
