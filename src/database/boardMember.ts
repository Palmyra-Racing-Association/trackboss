import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';
import { boardMember, PatchBoardMemberRequest, PostNewBoardMemberRequest } from 'src/typedefs/boardMember';

import logger from '../logger';
import { getPool } from './pool';

export const INSERT_BOARD_MEMBER_SQL =
    'INSERT INTO board_member(year, member_id, board_title_id) VALUES (?, ?, ?)';
export const GET_BOARD_MEMBER_LIST_SQL = 'SELECT * FROM v_board_member';
export const GET_BOARD_MEMBER_SQL = `${GET_BOARD_MEMBER_LIST_SQL} WHERE board_id = ?`;
export const GET_BOARD_MEMBER_YEAR_SQL = `${GET_BOARD_MEMBER_LIST_SQL} WHERE year = ?`;
export const PATCH_BOARD_MEMBER_SQL = 'CALL sp_patch_board_member(?, ?, ?, ?)';
export const DELETE_BOARD_MEMBER_SQL = 'DELETE FROM board_member where board_id = ?';

export async function insertBoardMember(req: PostNewBoardMemberRequest): Promise<number> {
    const values = [req.year, req.memberId, req.boardMemberTitleId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_BOARD_MEMBER_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting board member in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting board member: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getBoardMemberList(year?: string): Promise<boardMember[]> {
    let sql;
    let values: string[];
    if (typeof year !== 'undefined') {
        sql = GET_BOARD_MEMBER_YEAR_SQL;
        values = [year];
    } else {
        sql = GET_BOARD_MEMBER_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting board member list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        boardId: result.board_id,
        title: result.title,
        year: result.year,
        memberId: result.member_id,
    }));
}

export async function getBoardMember(id: number): Promise<boardMember> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_BOARD_MEMBER_SQL, values);
    } catch (e) {
        logger.error(`DB error getting board member: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        boardId: results[0].board_id,
        title: results[0].title,
        year: results[0].year,
        memberId: results[0].member_id,
    };
}

export async function patchBoardMember(id: number, req: PatchBoardMemberRequest): Promise<void> {
    const values = [id, req.year, req.memberId, req.boardMemberTitleId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_BOARD_MEMBER_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching board member in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching board member: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function deleteBoardMember(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(DELETE_BOARD_MEMBER_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting board member: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
