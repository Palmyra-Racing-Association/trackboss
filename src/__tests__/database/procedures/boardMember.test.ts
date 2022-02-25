import _ from 'lodash';
import mysql, { OkPacket, RowDataPacket } from 'mysql2/promise';

import config from './config';

const pool = mysql.createPool(config);

const CHECK_SQL = 'SELECT * from board_member WHERE board_id = ?';
const PROC_SQL = 'CALL sp_patch_board_member(?, ?, ?, ?)';

afterAll(async () => {
    await pool.end();
});

describe('sp_patch_board_member()', () => {
    it('Patches all fields', async () => {
        // Original: 1, 2022, 1, 1
        const boardId = 1;
        const values = [boardId, 2023, 10, 9];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [boardId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].board_id).toBe(boardId);
        expect(checkResults[0].year).toBe(values[1]);
        expect(checkResults[0].member_id).toBe(values[2]);
        expect(checkResults[0].board_title_id).toBe(values[3]);
    });

    it('Patches year field', async () => {
        const boardId = 2;
        const origValues = [boardId, 2022, 2, 2];
        const values = [boardId, 9999, null, null];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [boardId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].board_id).toBe(boardId);
        expect(checkResults[0].year).toBe(values[1]);
        expect(checkResults[0].member_id).toBe(origValues[2]);
        expect(checkResults[0].board_title_id).toBe(origValues[3]);
    });

    it('Patches memberId field', async () => {
        const boardId = 3;
        const origValues = [boardId, 2022, 3, 3];
        const values = [boardId, null, 15, null];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [boardId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].board_id).toBe(boardId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].member_id).toBe(values[2]);
        expect(checkResults[0].board_title_id).toBe(origValues[3]);
    });

    it('Patches boardTitleId field', async () => {
        const boardId = 4;
        const origValues = [boardId, 2022, 4, 4];
        const values = [boardId, null, null, 5];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);

        const checkValues = [boardId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].board_id).toBe(boardId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].member_id).toBe(origValues[2]);
        expect(checkResults[0].board_title_id).toBe(values[3]);
    });

    it('Patches no fields', async () => {
        const boardId = 8;
        const origValues = [boardId, 2022, 8, 6];
        const values = [boardId, null, null, null];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(1);
        const checkValues = [boardId];

        const [checkResults] = await pool.query<RowDataPacket[]>(CHECK_SQL, checkValues);
        expect(!_.isEmpty(checkResults));
        expect(checkResults[0].board_id).toBe(boardId);
        expect(checkResults[0].year).toBe(origValues[1]);
        expect(checkResults[0].member_id).toBe(origValues[2]);
        expect(checkResults[0].board_title_id).toBe(origValues[3]);
    });

    it('Patches nothing without boardId', async () => {
        const values = [null, null, null, null];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });

    it('Patches nothing when boardId not found', async () => {
        const values = [8888, null, null, null];

        const [result] = await pool.query<OkPacket>(PROC_SQL, values);
        expect(result.affectedRows).toBe(0);
    });
});
