import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const PROC_SQL = 'CALL sp_patch_event_job(?, ?, ?, ?)';
const CHECK_SQL = 'SELECT event_job_id, event_type_id, job_type_id, count FROM event_job WHERE event_job_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- event_job_id,
- event_type_id,
- job_type_id,
- count,
*/

describe('sp_patch_event_job()', () => {
    it('Patches all fields', async () => {
        const eventJobId = 1;
        const values = [eventJobId, 2, 3, 100];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [eventJobId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].event_job_id).toBe(eventJobId);
        expect(checkResults[0].event_type_id).toBe(values[1]);
        expect(checkResults[0].job_type_id).toBe(values[2]);
        expect(checkResults[0].count).toBe(values[3]);
    });

    it('Patches event_type_id field', async () => {
        const eventJobId = 2;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);

        const values = Array(4).fill(null);
        values[0] = eventJobId;
        values[1] = 4;

        expResults[0].event_type_id = 4;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(expResults[0]);
    });

    it('Patches job_type_id field', async () => {
        const eventJobId = 3;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);

        const values = Array(4).fill(null);
        values[0] = eventJobId;
        values[2] = 4;

        expResults[0].job_type_id = 4;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(expResults[0]);
    });

    it('Patches count field', async () => {
        const eventJobId = 4;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);

        const values = Array(4).fill(null);
        values[0] = eventJobId;
        values[3] = 9999;

        expResults[0].count = 9999;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [eventJobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(expResults[0]);
    });

    it('Throws on improper user input', async () => {
        const eventJobId = 5;
        const values = Array(4).fill(null);
        values[0] = eventJobId;
        values[1] = 'notAnInteger';

        await expect(pool.query<OkPacket>(PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without eventJobId', async () => {
        const values = Array(4).fill(null);

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when eventJobId not found', async () => {
        const values = Array(4).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
