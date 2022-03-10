import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { MemberType, PatchMemberTypeRequest } from '../typedefs/memberType';

export const GET_MEMBER_TYPE_LIST_SQL = 'SELECT * FROM v_member_type';
export const GET_MEMBER_TYPE_SQL = `${GET_MEMBER_TYPE_LIST_SQL} WHERE member_type_id = ?`;
export const PATCH_MEMBER_TYPE_SQL = 'CALL sp_patch_member_type(?, ?, ?)';

export async function getMemberType(id: number): Promise<MemberType> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_MEMBER_TYPE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting member type: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        memberTypeId: results[0].member_type_id,
        type: results[0].type,
        baseDuesAmt: results[0].base_dues_amt,
    };
}

export async function getMemberTypeList(): Promise<MemberType[]> {
    const sql = GET_MEMBER_TYPE_LIST_SQL;
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        memberTypeId: result.member_type_id,
        type: result.type,
        baseDuesAmt: result.base_dues_amt,
    }));
}

export async function patchMemberType(id: number, req: PatchMemberTypeRequest): Promise<void> {
    const values = [id, req.type, req.baseDuesAmt];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_MEMBER_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching member type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching member type: ${e}`);
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
