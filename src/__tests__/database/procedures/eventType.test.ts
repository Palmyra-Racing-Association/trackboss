import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${date.getDate().toString().padStart(2, '0')}`;
};

const CHECK_SQL = 'SELECT event_type_id, type, DATE_FORMAT(last_modified_date, "%Y-%m-%d") AS last_modified_date, ' +
    'last_modified_by, active from event_type WHERE event_type_id = ?';

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_event_type()', () => {
    it('Patches all fields', async () => {
        // Original: 8, 'Camp and Ride', null, null, 1
        const eventTypeId = 8;
        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [eventTypeId, 'Camp and Ride TEST', 1, 2];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventTypeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_type_id).toBe(eventTypeId);
        expect(checkResults[0].type).toBe(values[1]);
        expect(checkResults[0].last_modified_date).toBe(today());
        expect(checkResults[0].last_modified_by).toBe(values[3]);
        expect(checkResults[0].active[0]).toBe(values[2]);
    });

    it('Patches type field', async () => {
        // Original: 9, 'Ride Day', null, null, 1
        const eventTypeId = 9;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventTypeId]);

        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [eventTypeId, 'Ride Day Test', null, 4];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventTypeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_type_id).toBe(eventTypeId);
        expect(checkResults[0].type).toBe(values[1]);
        expect(checkResults[0].last_modified_date).toBe(today());
        expect(checkResults[0].last_modified_by).toBe(values[3]);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
    });

    it('Patches active field', async () => {
        // Original: 5, 'Meeting', null, null, 1
        const eventTypeId = 5;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventTypeId]);

        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [eventTypeId, null, 0, 2];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventTypeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_type_id).toBe(eventTypeId);
        expect(checkResults[0].type).toBe(origValues[0].type);
        expect(checkResults[0].last_modified_date).toBe(today());
        expect(checkResults[0].last_modified_by).toBe(values[3]);
        expect(checkResults[0].active[0]).toBe(values[2]);
    });

    it('Patches no fields', async () => {
        // Original: 1, 'Race', null, null, 1
        const eventTypeId = 1;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventTypeId]);

        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [eventTypeId, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventTypeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_type_id).toBe(eventTypeId);
        expect(checkResults[0].type).toBe(origValues[0].type);
        expect(checkResults[0].last_modified_date).toBe(origValues[0].last_modified_date);
        expect(checkResults[0].last_modified_by).toBe(origValues[0].last_modified_by);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
    });

    it('Patches nothing without eventTypeId', async () => {
        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [null, null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when eventTypeId not found', async () => {
        const sql = 'CALL sp_patch_event_type(?, ?, ?, ?)';
        const values = [5000, null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });
});
