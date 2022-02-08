import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${date.getDate().toString().padStart(2, '0')}`;
};

const CHECK_SQL = 'SELECT member_id, membership_id, uuid, member_type_id, first_name, last_name, phone_number, ' +
    'occupation, email, DATE_FORMAT(member.birthdate, "%Y-%m-%d") AS birthdate, ' +
    'DATE_FORMAT(member.date_joined, "%Y-%m-%d") AS date_joined, ' +
    'DATE_FORMAT(member.last_modified_date, "%Y-%m-%d") AS last_modified_date, last_modified_by, active from member ' +
    'WHERE member_id = ?';

afterAll(async () => {
    await pool.end();
});

/*
For reference, the procedure's fields are in this order:
- member_id,
- membership_id,
- uuid,
- active,
- member_type_id,
- first_name,
- last_name,
- phone_number,
- occupation,
- email,
- birthdate,
- dateJoined,
- modifiedBy,
*/

describe('sp_patch_member()', () => {
    it('Patches all fields', async () => {
        // Original: 1, 2, null, 1, 1, Squeak, Trainywhel, 223-321-4438, Software Engineer,
        // squeaky@trainingwheels.com, 1981-08-13, 2016-10-18, null, null

        const memberId = 1;
        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [
            memberId,
            42,
            'definitelyAUuid',
            0,
            2,
            'test',
            'lastTest',
            '123-456-7890',
            'Tester',
            'test@testing.com',
            '2000-01-01',
            '2000-01-02',
            42,
        ];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [memberId];
        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(values[1]);
        expect(checkResults[0].uuid).toBe(values[2]);
        expect(checkResults[0].active[0]).toBe(values[3]);
        expect(checkResults[0].member_type_id).toBe(values[4]);
        expect(checkResults[0].first_name).toBe(values[5]);
        expect(checkResults[0].last_name).toBe(values[6]);
        expect(checkResults[0].phone_number).toBe(values[7]);
        expect(checkResults[0].occupation).toBe(values[8]);
        expect(checkResults[0].email).toBe(values[9]);
        expect(checkResults[0].birthdate).toBe(values[10]);
        expect(checkResults[0].date_joined).toBe(values[11]);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches membership_id field', async () => {
        const memberId = 2;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[1] = 42;
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(values[1]);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches uuid field', async () => {
        const memberId = 3;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[2] = 'aNewUuid';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(values[2]);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches active field', async () => {
        const memberId = 4;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[3] = 0;
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(values[3]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches member_type_id field', async () => {
        const memberId = 5;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[4] = 1;
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(values[4]);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches first_name field', async () => {
        const memberId = 6;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[5] = 'newFirstName';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(values[5]);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches last_name field', async () => {
        const memberId = 7;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[6] = 'newLastName';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(values[6]);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches phone_number field', async () => {
        const memberId = 8;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[7] = '888-888-8888';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(values[7]);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches occupation field', async () => {
        const memberId = 9;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[8] = 'Involuntary Tester';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(values[8]);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches email field', async () => {
        const memberId = 10;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[9] = 'test@test.io';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(values[9]);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches birthdate field', async () => {
        const memberId = 11;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[10] = '1900-01-31';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(values[10]);
        expect(checkResults[0].date_joined).toBe(origValues[0].date_joined);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Patches date_joined field', async () => {
        const memberId = 12;
        const [origValues] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);

        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[11] = '1900-02-01';
        values[12] = 42;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, [memberId]);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].member_id).toBe(memberId);
        expect(checkResults[0].membership_id).toBe(origValues[0].membership_id);
        expect(checkResults[0].uuid).toBe(origValues[0].uuid);
        expect(checkResults[0].active[0]).toBe(origValues[0].active[0]);
        expect(checkResults[0].member_type_id).toBe(origValues[0].member_type_id);
        expect(checkResults[0].first_name).toBe(origValues[0].first_name);
        expect(checkResults[0].last_name).toBe(origValues[0].last_name);
        expect(checkResults[0].phone_number).toBe(origValues[0].phone_number);
        expect(checkResults[0].occupation).toBe(origValues[0].occupation);
        expect(checkResults[0].email).toBe(origValues[0].email);
        expect(checkResults[0].birthdate).toBe(origValues[0].birthdate);
        expect(checkResults[0].date_joined).toBe(values[11]);
        expect(checkResults[0].last_modified_by).toBe(values[12]);
        expect(checkResults[0].last_modified_date).toBe(today());
    });

    it('Throws on improper user input', async () => {
        const memberId = 13;
        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = memberId;
        values[12] = 0;

        await expect(pool.query<OkPacket>(sql, values)).rejects.toThrowError();
    });

    it('Patches nothing without memberId', async () => {
        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when memberId not found', async () => {
        const sql = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = Array(13).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });
});
