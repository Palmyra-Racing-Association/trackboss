import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';
import {
    BoardMemberType,
    PostNewBoardMemberTypeRequest,
    PatchBoardMemberTypeRequest,
} from 'src/typedefs/boardMemberType';

import logger from '../logger';
import { getPool } from './pool';

export const INSERT_BOARD_MEMBER_TYPE_SQL = 'INSERT INTO board_member_title(title) VALUES (?)';
export const GET_BOARD_MEMBER_TYPE_LIST_SQL = 'SELECT * FROM board_member_title';
export const GET_BOARD_MEMBER_TYPE_SQL = `${GET_BOARD_MEMBER_TYPE_LIST_SQL} WHERE board_title_id = ?`;
export const PATCH_BOARD_MEMBER_TYPE_SQL = 'UPDATE board_member_title SET title = ? where board_title_id = ?';
export const DELETE_BOARD_MEMBER_TYPE_SQL = 'DELETE FROM board_member_title where board_title_id = ?';

export async function insertBoardMemberType(req: PostNewBoardMemberTypeRequest): Promise<number> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [req.title];
    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_BOARD_MEMBER_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting board member type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting board member type: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getBoardMemberTypeList(): Promise<BoardMemberType[]> {
    const sql = GET_BOARD_MEMBER_TYPE_LIST_SQL;
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting board member type list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        boardTypeId: result.board_title_id,
        title: result.title,
    }));
}

export async function getBoardMemberType(id: number): Promise<BoardMemberType> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_BOARD_MEMBER_TYPE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting board member type: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        boardTypeId: results[0].board_title_id,
        title: results[0].title,
    };
}

export async function patchBoardMemberType(id: number, req: PatchBoardMemberTypeRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [req.title, id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_BOARD_MEMBER_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching board member type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching board member type: ${e}`);
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

export async function deleteBoardMemberType(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(DELETE_BOARD_MEMBER_TYPE_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting board member type: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
