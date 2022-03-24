import { format } from 'date-fns';
import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = format(new Date(), 'yyyy-MM-dd');

const CHECK_SQL = 'SELECT job_id, member_id, event_id, job_type_id, ' +
    'DATE_FORMAT(job_start_date, "%Y-%m-%d %H:%i:%s") as job_start_date, ' +
    'DATE_FORMAT(job_end_date, "%Y-%m-%d %H:%i:%s") as job_end_date, ' +
    'points_awarded, verified, DATE_FORMAT(verified_date, "%Y-%m-%d") AS verified_date, paid, ' +
    'DATE_FORMAT(paid_date, "%Y-%m-%d") AS paid_date, last_modified_by, DATE_FORMAT(last_modified_date, "%Y-%m-%d") ' +
    'AS last_modified_date FROM job WHERE job_id = ?';

const PATCH_SQL = 'CALL sp_patch_job(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- job_id,
- member_id,
- _event_id,
- _job_type_id,
- _job_start_date,
- _job_end_date,
- _points_awarded,
- _verified,
- _paid,
- _modified_by,
*/

describe('sp_patch_job()', () => {
    it('Patches all fields', async () => {
        // Original: 1, 2, 1, 80, 2020-02-01 00:00:00, 2020-02-15 00:00:00, 1, 1, 2020-02-15, 3
        // 0, null

        const jobId = 1;
        const values = [
            jobId,
            3,
            2,
            81,
            '2021-02-01 05:00:00',
            '2021-02-01 09:00:00',
            4,
            0,
            1,
            2,
        ];

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [jobId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].job_id).toBe(jobId);
        expect(checkResults[0].member_id).toBe(values[1]);
        expect(checkResults[0].event_id).toBe(values[2]);
        expect(checkResults[0].job_type_id).toBe(values[3]);
        expect(checkResults[0].job_start_date).toBe(values[4]);
        expect(checkResults[0].job_end_date).toBe(values[5]);
        expect(checkResults[0].points_awarded).toBe(values[6]);
        expect(checkResults[0].verified[0]).toBe(values[7]);
        expect(checkResults[0].paid[0]).toBe(values[8]);
        expect(checkResults[0].last_modified_by).toBe(values[9]);
        expect(checkResults[0].verified_date).toBeNull(); // Since we just un verified this
        expect(checkResults[0].paid_date).toBe(today); // Since we just paid this
        expect(checkResults[0].last_modified_date).toBe(today);
    });
    it('Patches member_id field', async () => {
        const jobId = 2;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[1] = 42;
        values[9] = 42;

        origValues[0].member_id = 42;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches event_id field', async () => {
        const jobId = 3;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[2] = 3;
        values[9] = 42;

        origValues[0].event_id = 3;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches job_type_id field', async () => {
        const jobId = 4;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[3] = 10;
        values[9] = 42;

        origValues[0].job_type_id = 10;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches job_start_date field', async () => {
        const jobId = 5;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[4] = '2020-01-01 20:00:00';
        values[9] = 42;

        origValues[0].job_start_date = '2020-01-01 20:00:00';
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches job_end_date field', async () => {
        const jobId = 5;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[5] = '2020-01-02 20:00:00';
        values[9] = 42;

        origValues[0].job_end_date = '2020-01-02 20:00:00';
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches points_awarded field', async () => {
        const jobId = 6;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[6] = 5;
        values[9] = 42;

        origValues[0].points_awarded = 5;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches verified field', async () => {
        const jobId = 10;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(9).fill(null);
        values[0] = jobId;
        values[7] = 1;
        values[9] = 42;

        origValues[0].verified[0] = 1;
        origValues[0].verified_date = today;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches un-verified field', async () => {
        const jobId = 10;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[7] = 0;
        values[9] = 42;

        origValues[0].verified[0] = 0;
        origValues[0].verified_date = null;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches paid field', async () => {
        const jobId = 15;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[8] = 1;
        values[9] = 42;

        origValues[0].paid[0] = 1;
        origValues[0].paid_date = today;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
    it('Patches un-paid field', async () => {
        const jobId = 15;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);

        const values = Array(10).fill(null);
        values[0] = jobId;
        values[8] = 0;
        values[9] = 42;

        origValues[0].paid[0] = 0;
        origValues[0].paid_date = null;
        origValues[0].last_modified_by = 42;
        origValues[0].last_modified_date = today;

        const [result] = await pool.query<OkPacket>(PATCH_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0]).toEqual(origValues[0]);
    });
});
