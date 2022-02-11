import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const CHECK_SQL = 'SELECT event_id, DATE_FORMAT(date, "%Y-%m-%d") AS date, ' +
    'event_type_id, event_name, event_description from event WHERE event_id = ?';

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_bike()', () => {
    it('Patches all fields', async () => {
        const eventId = 5;
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, '2022-02-11', 'Free Rider', 'Test Patch'];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].date).toBe(values[1]);
        expect(checkResults[0].event_name).toBe(values[2]);
        expect(checkResults[0].event_description).toBe(values[3]);
    });

    it('Patches date field', async () => {
        const eventId = 4;
        const origValues = [eventId, '2022-01-11', 'Harescrambler', 'test harescrambler job generation!'];
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, '2022-02-11', null, null];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].date).toBe(values[1]);
        expect(checkResults[0].event_name).toBe(origValues[2]);
        expect(checkResults[0].event_description).toBe(origValues[3]);
    });

    it('Patches eventName field', async () => {
        const eventId = 3;
        const origValues = [eventId, '2022-02-01', 'Yearly Meeting', 'test meeting!'];
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, null, 'Testrambler', null];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].date).toBe(origValues[1]);
        expect(checkResults[0].event_name).toBe(values[2]);
        expect(checkResults[0].event_description).toBe(origValues[3]);
    });

    it('Patches eventDescription field', async () => {
        const eventId = 1;
        const origValues = [eventId, '2020-02-01', 'The First Race', 'test first race!'];
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, null, null, 'test'];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].date).toBe(origValues[1]);
        expect(checkResults[0].event_name).toBe(origValues[2]);
        expect(checkResults[0].event_description).toBe(values[3]);
    });

    it('Patches no fields', async () => {
        const eventId = 2;
        const origValues = [eventId, '2021-05-15', 'XO Race', 'Test XO Race Job Generation'];
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, null, null, null];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].date).toBe(origValues[1]);
        expect(checkResults[0].event_name).toBe(origValues[2]);
        expect(checkResults[0].event_description).toBe(origValues[3]);
    });

    it('Patches nothing without eventId', async () => {
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when eventId not found', async () => {
        const eventId = 9000;
        const sql = 'CALL sp_patch_event(?, ?, ?, ?)';
        const values = [eventId, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });

    // need tests for
    // moving the jobs days linked to event?
    // sp_delete
    // sp_event_job_gen
});
