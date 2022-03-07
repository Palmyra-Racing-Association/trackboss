import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const CHECK_SQL_ID = 'SELECT event_id, DATE_FORMAT(start_date, "%Y-%m-%d %H:%i:%s") as start_date, ' +
    'DATE_FORMAT(end_date, "%Y-%m-%d %H:%i:%s") as end_date, event_type_id, event_name, event_description ' +
    'from event WHERE event_id = ?';

const CHECK_SQL_NAME = 'SELECT event_id, DATE_FORMAT(start_date, "%Y-%m-%d %H:%i:%s") as start_date, ' +
    'DATE_FORMAT(end_date, "%Y-%m-%d %H:%i:%s") as end_date, event_type_id, event_name, event_description ' +
    'from event WHERE event_name = ?;';

const PATCH_SQL = 'CALL sp_patch_event(?, ?, ?, ?, ?)';

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_event()', () => {
    it('Patches all fields', async () => {
        const eventId = 5;
        const values = [eventId, '2021-03-16 09:00:00', '2021-03-16 12:00:00', 'Free Rider', 'Test Patch'];
        await pool.query<OkPacket>(PATCH_SQL, values);
        const checkValues = [values[3]];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_NAME, checkValues);

        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBeGreaterThan(eventId);
        expect(checkResults[0].start_date).toBe(values[1]);
        expect(checkResults[0].end_date).toBe(values[2]);
        expect(checkResults[0].event_name).toBe(values[3]);
        expect(checkResults[0].event_description).toBe(values[4]);
    });

    it('Patches end date field', async () => {
        const eventId = 4;
        const origValues =
        [eventId, '2022-01-11 08:00:00', '2022-01-13 08:00:00', 'Harescrambler', 'test harescrambler job generation!'];
        const values = [eventId, null, '2022-02-11 08:00:00', null, null];
        await pool.query<OkPacket>(PATCH_SQL, values);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_NAME, origValues[3]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].start_date).toBe(origValues[1]);
        expect(checkResults[0].end_date).toBe(values[2]);
        expect(checkResults[0].event_name).toBe(origValues[3]);
        expect(checkResults[0].event_description).toBe(origValues[4]);
    });

    it('Patches start date field', async () => {
        const eventId = 4;
        const origValues =
        [eventId, '2022-01-11 08:00:00', '2022-02-11 08:00:00', 'Harescrambler', 'test harescrambler job generation!'];
        const values = [eventId, '2022-02-11 08:00:00', null, null, null];
        await pool.query<OkPacket>(PATCH_SQL, values);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_NAME, origValues[3]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBeGreaterThan(eventId);
        expect(checkResults[0].start_date).toBe(values[1]);
        expect(checkResults[0].end_date).toBe(origValues[2]);
        expect(checkResults[0].event_name).toBe(origValues[3]);
        expect(checkResults[0].event_description).toBe(origValues[4]);
    });

    it('Patches eventName field', async () => {
        const eventId = 3;
        const origValues = [eventId, '2022-02-01 09:00:00', '2022-02-01 15:00:00', 'Yearly Meeting', 'test meeting!'];
        const values = [eventId, null, null, 'Testrambler', null];
        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_ID, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].start_date).toBe(origValues[1]);
        expect(checkResults[0].end_date).toBe(origValues[2]);
        expect(checkResults[0].event_name).toBe(values[3]);
        expect(checkResults[0].event_description).toBe(origValues[4]);
    });

    it('Patches eventDescription field', async () => {
        const eventId = 1;
        const origValues = [eventId, '2020-02-01 08:00:00', '2020-02-02 16:00:00', 'The First Race', 'test first race'];
        const values = [eventId, null, null, null, 'test'];
        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_ID, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].start_date).toBe(origValues[1]);
        expect(checkResults[0].end_date).toBe(origValues[2]);
        expect(checkResults[0].event_name).toBe(origValues[3]);
        expect(checkResults[0].event_description).toBe(values[4]);
    });

    it('Patches no fields', async () => {
        const eventId = 2;
        const origValues =
        [eventId, '2021-05-15 10:00:00', '2021-05-19 10:00:00', 'XO Race', 'Test XO Race Job Generation'];
        const values = [eventId, null, null, null, null];
        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_ID, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_id).toBe(eventId);
        expect(checkResults[0].start_date).toBe(origValues[1]);
        expect(checkResults[0].end_date).toBe(origValues[2]);
        expect(checkResults[0].event_name).toBe(origValues[3]);
        expect(checkResults[0].event_description).toBe(origValues[4]);
    });

    it('Patches nothing without eventId', async () => {
        const values = [null, null, null, null, null];

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when eventId not found', async () => {
        const eventId = 9000;
        const values = [eventId, null, null, null, null];

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});

describe('sp_event_job_generation()', () => {
    it('generates jobs', async () => {
        const date = '2000-10-10 09:00:00';
        const endDate = '2000-10-15 15:00:00';
        const eventTypeId = 3;

        const sql = 'CALL sp_event_job_generation(?, ?, ?, ?, ?)';
        const checkJobSql = 'SELECT COUNT(*) as cnt FROM job;';
        const checkEventSql = 'SELECT COUNT(*) as cnt FROM event;';
        const values = [date, endDate, eventTypeId, 'event job test', 'testing for event job'];

        const [beforeJobTotal] = await pool.query<RowDataPacket[]>(checkJobSql, []);
        const [beforeEventTotal] = await pool.query<RowDataPacket[]>(checkEventSql, []);
        await pool.query<OkPacket>(sql, values);
        const [afterJobTotal] = await pool.query<RowDataPacket[]>(checkJobSql, []);
        const [afterEventTotal] = await pool.query<RowDataPacket[]>(checkEventSql, []);

        const howManyJobsSql = 'select SUM(count) as cnt from event_job ' +
        'where event_type_id = ? group by event_type_id';
        const [result1] = await pool.query<RowDataPacket[]>(howManyJobsSql, [eventTypeId]);

        expect(afterEventTotal[0].cnt - beforeEventTotal[0].cnt).toBe(1);
        expect(afterJobTotal[0].cnt - beforeJobTotal[0].cnt).toBe(+result1[0].cnt);
    });
});

describe('sp_delete_event()', () => {
    it('deletes an event', async () => {
        const eventId = 1;
        const sql = 'CALL sp_delete_event(?)';
        const values = [eventId];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL_ID, checkValues);
        expect(_.isEmpty(checkResults));

        const checkSql = 'SELECT * FROM job where event_id = ?;';
        const [checkJobResults] = await pool.query<RowDataPacket[]>(checkSql, values);
        expect(_.isEmpty(checkJobResults));
    });

    it('delete a non-existing event', async () => {
        const eventId = 500;
        const sql = 'CALL sp_delete_event(?)';
        const values = [eventId];
        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });
});
