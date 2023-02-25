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
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }

    const values = [id, req.type, req.baseDuesAmt];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_MEMBER_TYPE_SQL, values);
    } catch (e: any) {
        logger.error(`DB error patching member type: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function getMembershipTypeCounts(): Promise<MemberType[]> {
    const sql = `
        select ms.membership_type, mt.base_dues_amt, mt.membership_type_id, count(*) howmany
        from v_membership ms, membership_types mt where 
        ms.status = 'active' and
        ms.membership_type is not null and
        ms.membership_type = mt.type
        group by ms.membership_type
    `;
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        memberTypeId: result.membership_type_id,
        type: result.membership_type,
        baseDuesAmt: result.base_dues_amt,
        count: result.howmany,
    }));
}
