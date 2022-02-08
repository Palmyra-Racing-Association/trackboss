import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { Member, PatchMemberRequest, PostNewMemberRequest } from '../typedefs/member';

// Map the API values for the member types to the DB values
const MEMBER_TYPE_MAP = new Map([
    ['admin', 'Admin'],
    ['membershipAdmin', 'Membership Admin'],
    ['member', 'Member'],
    ['paidLaborer', 'Paid Laborer'],
]);
export const GET_MEMBER_LIST_SQL = 'SELECT * FROM v_member';
export const GET_MEMBER_LIST_BY_TYPE_SQL = `${GET_MEMBER_LIST_SQL} WHERE member_type = ?`;
export const GET_MEMBER_SQL = `${GET_MEMBER_LIST_SQL} WHERE member_id = ?`;
export const INSERT_MEMBER_SQL = 'INSERT INTO member (membership_id, uuid, member_type_id, first_name, last_name, ' +
    'phone_number, occupation, email, birthdate, date_joined, last_modified_date, last_modified_by, active) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, 1)';
export const PATCH_MEMBER_SQL = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

export async function insertMember(req: PostNewMemberRequest): Promise<number> {
    const values = [
        req.membershipId,
        req.uuid,
        req.memberTypeId,
        req.firstName,
        req.lastName,
        req.phoneNumber,
        req.occupation,
        req.email,
        req.birthdate,
        req.dateJoined,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_MEMBER_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting member in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting member: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getMemberList(type?: string): Promise<Member[]> {
    let sql;
    let values: string[];
    if (typeof type !== 'undefined') {
        sql = GET_MEMBER_LIST_BY_TYPE_SQL;
        // if type is not in the map, it won't hurt to throw it in
        // anyway (and this makes testing easier)
        values = [MEMBER_TYPE_MAP.get(type) || type];
    } else {
        sql = GET_MEMBER_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        memberId: result.member_id,
        firstName: result.first_name,
        lastName: result.last_name,
        membershipAdmin: result.membership_admin,
        uuid: result.uuid,
        active: result.active[0],
        memberType: result.member_type,
        phoneNumber: result.phone_number,
        occupation: result.occupation,
        email: result.email,
        birthdate: result.birthdate,
        dateJoined: result.date_joined,
        address: result.address,
        city: result.city,
        state: result.state,
        zip: result.zip,
        lastModifiedDate: result.last_modified_date,
        lastModifiedBy: result.last_modified_by,
    }));
}

export async function getMember(id: number): Promise<Member> {
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_MEMBER_SQL, values);
    } catch (e) {
        logger.error(`DB error getting member: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        memberId: results[0].member_id,
        firstName: results[0].first_name,
        lastName: results[0].last_name,
        membershipAdmin: results[0].membership_admin,
        uuid: results[0].uuid,
        active: results[0].active[0],
        memberType: results[0].member_type,
        phoneNumber: results[0].phone_number,
        occupation: results[0].occupation,
        email: results[0].email,
        birthdate: results[0].birthdate,
        dateJoined: results[0].date_joined,
        address: results[0].address,
        city: results[0].city,
        state: results[0].state,
        zip: results[0].zip,
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
    };
}

export async function patchMember(id: number, req: PatchMemberRequest): Promise<void> {
    const values = [
        id,
        req.membershipId,
        req.uuid,
        req.active,
        req.memberTypeId,
        req.firstName,
        req.lastName,
        req.phoneNumber,
        req.occupation,
        req.email,
        req.birthdate,
        req.dateJoined,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_MEMBER_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching member in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching member: ${e}`);
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
