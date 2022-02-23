import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${date.getDate().toString().padStart(2, '0')}`;
};

const PROC_SQL = 'CALL sp_patch_job_type(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const CHECK_SQL = 'SELECT job_type_id, title, point_value, cash_value, job_day_number, active, reserved, ' +
    'online, meal_ticket, sort_order, DATE_FORMAT(job_type.last_modified_date, "%Y-%m-%d") AS last_modified_date, ' +
    'last_modified_by from job_type WHERE job_type_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- job_type_id,
- title,
- point_value,
- cash_value,
- job_day_number,
- active,
- reserved,
- online,
- meal_ticket,
- sort_order,
- modifiedBy,
*/

describe('sp_patch_job_type()', () => {
    it('Patches all fields', async () => {
        const jobTypeId = 1;
        const values = [
            jobTypeId,
            'jobType',
            5,
            10.50,
            3,
            1,
            0,
            1,
            1,
            1,
            42,
        ];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [jobTypeId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].job_type_id).toBe(jobTypeId);
        expect(checkResults[0].title).toBe(values[1]);
        expect(checkResults[0].point_value).toBe(values[2]);
        expect(checkResults[0].cash_value).toBe(values[3]);
        expect(checkResults[0].job_day_number).toBe(values[4]);
        expect(checkResults[0].active[0]).toBe(values[5]);
        expect(checkResults[0].reserved[0]).toBe(values[6]);
        expect(checkResults[0].online[0]).toBe(values[7]);
        expect(checkResults[0].meal_ticket[0]).toBe(values[8]);
        expect(checkResults[0].sort_order).toBe(values[9]);
        expect(checkResults[0].last_modified_by).toBe(values[10]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches title field', async () => {
        const jobTypeId = 2;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[1] = 'newJobType';
        values[10] = 42;

        expResults[0].title = 'newJobType';
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches point_value field', async () => {
        const jobTypeId = 3;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[2] = 214.1;
        values[10] = 42;

        expResults[0].point_value = 214.1;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches cash_value field', async () => {
        const jobTypeId = 4;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[3] = 1247.13;
        values[10] = 42;

        expResults[0].cash_value = 1247.13;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches job_day_number field', async () => {
        const jobTypeId = 5;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[4] = 6;
        values[10] = 42;

        expResults[0].job_day_number = 6;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches active field', async () => {
        const jobTypeId = 6;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[5] = 0;
        values[10] = 42;

        expResults[0].active[0] = 0;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches reserved field', async () => {
        const jobTypeId = 7;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[6] = 1;
        values[10] = 42;

        expResults[0].reserved[0] = 1;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches online field', async () => {
        const jobTypeId = 8;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[7] = 0;
        values[10] = 42;

        expResults[0].online[0] = 0;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches meal_ticket field', async () => {
        const jobTypeId = 9;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[8] = 0;
        values[10] = 42;

        expResults[0].meal_ticket[0] = 0;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Patches sort_order field', async () => {
        const jobTypeId = 10;
        const [expResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);

        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[9] = 23;
        values[10] = 42;

        expResults[0].sort_order = 23;
        expResults[0].last_modified_by = 42;
        expResults[0].last_modified_date = today();

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [jobTypeId]);
        expect(!_.isEmpty(checkResults));
        expect(_.isEqual(checkResults[0], expResults[0]));
    });

    it('Throws on improper user input', async () => {
        const jobTypeId = 11;
        const values = Array(11).fill(null);
        values[0] = jobTypeId;
        values[10] = 0;

        await expect(pool.query<OkPacket>(PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without jobTypeId', async () => {
        const values = Array(11).fill(null);

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when jobTypeId not found', async () => {
        const values = Array(11).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
