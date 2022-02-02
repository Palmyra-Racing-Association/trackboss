import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_bike()', () => {
    it('Patches all fields', async () => {
        // Original: 40, 2010, Honda, TT-R230, 48
        const bikeId = 40;
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, '9999', 'Burger King', 'Chicken Fry', 49];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(values[1]);
        expect(checkResults[0].make).toBe(values[2]);
        expect(checkResults[0].model).toBe(values[3]);
        expect(checkResults[0].membership_id).toBe(values[4]);
    });

    it('Patches year field', async () => {
        const bikeId = 41;
        const origValues = [bikeId, '2005', 'Honda', 'YZ125', 23];
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, '9999', null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(values[1]);
        expect(checkResults[0].make).toBe(origValues[2]);
        expect(checkResults[0].model).toBe(origValues[3]);
        expect(checkResults[0].membership_id).toBe(origValues[4]);
    });

    it('Patches make field', async () => {
        const bikeId = 42;
        const origValues = [bikeId, '2009', 'Yamaha', 'WR250R', 15];
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, null, 'Walmart', null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].make).toBe(values[2]);
        expect(checkResults[0].model).toBe(origValues[3]);
        expect(checkResults[0].membership_id).toBe(origValues[4]);
    });

    it('Patches model field', async () => {
        const bikeId = 43;
        const origValues = [bikeId, '2005', 'Yamaha', 'WR450F', 6];
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, null, null, 'STW100', null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].make).toBe(origValues[2]);
        expect(checkResults[0].model).toBe(values[3]);
        expect(checkResults[0].membership_id).toBe(origValues[4]);
    });

    it('Patches membership_id field', async () => {
        const bikeId = 44;
        const origValues = [bikeId, '1996', 'Suzuki', 'YZ125', 42];
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, null, null, null, 15];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].make).toBe(origValues[2]);
        expect(checkResults[0].model).toBe(origValues[3]);
        expect(checkResults[0].membership_id).toBe(values[4]);
    });

    it('Patches no fields', async () => {
        const bikeId = 45;
        const origValues = [bikeId, '2009', 'Suzuki', 'WR250R', 42];
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [bikeId, null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(1);

        const checkSql = 'SELECT * from member_bikes WHERE bike_id = ?';
        const checkValues = [bikeId];

        const [checkResults] = await pool.query<RowDataPacket[]>(checkSql, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].bike_id).toBe(bikeId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].make).toBe(origValues[2]);
        expect(checkResults[0].model).toBe(origValues[3]);
        expect(checkResults[0].membership_id).toBe(origValues[4]);
    });

    it('Patches nothing without bikeId', async () => {
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [null, null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when bikeId not found', async () => {
        const sql = 'CALL sp_patch_bike(?, ?, ?, ?, ?)';
        const values = [3000, null, null, null, null];

        const [result] = await pool.query<OkPacket>(sql, values);
        expect(result.affectedRows).toBe(0);
    });
});
