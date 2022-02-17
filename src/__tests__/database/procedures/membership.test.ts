import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const today = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}` +
        `-${date.getDate().toString().padStart(2, '0')}`;
};

const PATCH_PROC_SQL = 'CALL sp_patch_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
const REGISTER_MEMBER_ID_OUT = '@member_id';
const REGISTER_MEMBERSHIP_ID_OUT = '@membership_id';
const REGISTER_PROC_SQL = `CALL sp_register_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ${REGISTER_MEMBER_ID_OUT}, ` +
    `${REGISTER_MEMBERSHIP_ID_OUT})`;
const GET_MEMBER_ID_SQL = `SELECT ${REGISTER_MEMBER_ID_OUT}`;
const GET_MEMBERSHIP_ID_SQL = `SELECT ${REGISTER_MEMBERSHIP_ID_OUT}`;
const MEMBER_CHECK_SQL = 'SELECT member_id, membership_id, uuid, member_type_id, first_name, last_name, ' +
    'phone_number, occupation, email, DATE_FORMAT(member.birthdate, "%Y-%m-%d") AS birthdate, ' +
    'DATE_FORMAT(member.date_joined, "%Y-%m-%d") AS date_joined, ' +
    'DATE_FORMAT(member.last_modified_date, "%Y-%m-%d") AS last_modified_date, last_modified_by, active from member ' +
    'WHERE member_id = ?';
const MEMBERSHIP_CHECK_SQL = 'SELECT membership_id, membership_admin_id, status, cur_year_renewed, renewal_sent, ' +
    'year_joined, address, city, state, zip, DATE_FORMAT(membership.last_modified_date, "%Y-%m-%d") ' +
    'AS last_modified_date, last_modified_by FROM membership WHERE membership_id = ?';

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

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [membershipId];
        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, checkValues);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[1] = 24;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[2] = 'Disabled';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[3] = 1;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[4] = 1;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[5] = 2222;
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[6] = 'newAddress';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[7] = 'newCity';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[8] = 'newState';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const [origValues] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);

        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[9] = 'newZip';
        values[10] = 42;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const [checkResults] = await pool.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId]);
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
        const values = Array(11).fill(null);
        values[0] = membershipId;
        values[10] = 0;

        await expect(pool.query<OkPacket>(PATCH_PROC_SQL, values)).rejects.toThrowError();
    });

    it('Patches nothing without membershipId', async () => {
        const values = Array(11).fill(null);

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when membershipId not found', async () => {
        const values = Array(11).fill(null);
        values[0] = 3000;

        const [result] = await pool.query<OkPacket>(PATCH_PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});

describe('sp_register_membership()', () => {
    it('Registers a new membership', async () => {
        const values = [
            1,
            'firstName',
            'lastName',
            'phoneNumber',
            'occupation',
            'em@il.com',
            '2000-01-01',
            'address',
            'city',
            'state',
            'zip',
        ];

        const expMember = {
            uuid: null,
            member_type_id: 1,
            first_name: 'firstName',
            last_name: 'lastName',
            phone_number: 'phoneNumber',
            occupation: 'occupation',
            email: 'em@il.com',
            birthdate: '2000-01-01',
            date_joined: today(),
            last_modified_date: today(),
            last_modified_by: null,
            active: 0,
        };
        const expMembership = {
            status: 'Pending',
            cur_year_renewed: 0,
            renewal_sent: 0,
            year_joined: new Date().getFullYear(),
            address: 'address',
            city: 'city',
            state: 'state',
            zip: 'zip',
            last_modified_date: today(),
            last_modified_by: null,
        };

        // Use a single connection for sequential queries with SQL variables
        // (variables are session-scoped)
        const conn = await pool.getConnection();

        await conn.query<OkPacket>(REGISTER_PROC_SQL, values);
        const [membershipId] = await conn.query<RowDataPacket[]>(GET_MEMBERSHIP_ID_SQL);
        const [membershipCheck] =
            await conn.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId[0][REGISTER_MEMBERSHIP_ID_OUT]]);

        expect(membershipCheck[0].status).toBe(expMembership.status);
        expect(membershipCheck[0].cur_year_renewed[0]).toBe(expMembership.cur_year_renewed);
        expect(membershipCheck[0].renewal_sent[0]).toBe(expMembership.renewal_sent);
        expect(membershipCheck[0].year_joined).toBe(expMembership.year_joined);
        expect(membershipCheck[0].address).toBe(expMembership.address);
        expect(membershipCheck[0].city).toBe(expMembership.city);
        expect(membershipCheck[0].state).toBe(expMembership.state);
        expect(membershipCheck[0].zip).toBe(expMembership.zip);
        expect(membershipCheck[0].last_modified_date).toBe(expMembership.last_modified_date);
        expect(membershipCheck[0].last_modified_by).toBe(expMembership.last_modified_by);

        const [memberId] = await conn.query<RowDataPacket[]>(GET_MEMBER_ID_SQL);
        const [memberCheck] =
            await conn.query<RowDataPacket[]>(MEMBER_CHECK_SQL, [memberId[0][REGISTER_MEMBER_ID_OUT]]);

        conn.release();

        expect(memberCheck[0].membership_id).toBe(membershipId[0]['@membership_id']);
        expect(memberCheck[0].uuid).toBe(expMember.uuid);
        expect(memberCheck[0].member_type_id).toBe(expMember.member_type_id);
        expect(memberCheck[0].first_name).toBe(expMember.first_name);
        expect(memberCheck[0].last_name).toBe(expMember.last_name);
        expect(memberCheck[0].phone_number).toBe(expMember.phone_number);
        expect(memberCheck[0].occupation).toBe(expMember.occupation);
        expect(memberCheck[0].email).toBe(expMember.email);
        expect(memberCheck[0].birthdate).toBe(expMember.birthdate);
        expect(memberCheck[0].date_joined).toBe(expMember.date_joined);
        expect(memberCheck[0].last_modified_date).toBe(expMember.last_modified_date);
        expect(memberCheck[0].last_modified_by).toBe(expMember.last_modified_by);
        expect(memberCheck[0].active[0]).toBe(expMember.active);
    });

    it('Discards membership insert on member error', async () => {
        const values = [
            3000, // should be FK violation when inserting to member
            'firstName',
            'lastName',
            'phoneNumber',
            'occupation',
            'em@il.com',
            '2000-01-01',
            'address',
            'city',
            'state',
            'zip',
        ];

        // Use a single connection for sequential queries with SQL variables
        // (variables are session-scoped)
        const conn = await pool.getConnection();

        await expect(conn.query<OkPacket>(REGISTER_PROC_SQL, values)).rejects.toThrowError();
        const [membershipId] = await conn.query<RowDataPacket[]>(GET_MEMBERSHIP_ID_SQL);
        const [membershipCheck] =
            await conn.query<RowDataPacket[]>(MEMBERSHIP_CHECK_SQL, [membershipId[0][REGISTER_MEMBERSHIP_ID_OUT]]);
        expect(_.isEmpty(membershipCheck));

        conn.release();
    });
});
