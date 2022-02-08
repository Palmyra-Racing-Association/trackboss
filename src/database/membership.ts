import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { Membership, PatchMembershipRequest, PostNewMembershipRequest } from '../typedefs/membership';

// Map the API values for the membership statuses to the DB values
const MEMBERSHIP_STATUS_MAP = new Map([
    ['active', 'Active'],
    ['inactive', 'Disabled'],
    ['pending', 'Pending'],
]);
export const GET_MEMBERSHIP_LIST_SQL = 'SELECT * FROM v_membership';
export const GET_MEMBERSHIP_LIST_BY_STATUS_SQL = `${GET_MEMBERSHIP_LIST_SQL} WHERE status = ?`;
export const GET_MEMBERSHIP_SQL = `${GET_MEMBERSHIP_LIST_SQL} WHERE membership_id = ?`;
export const INSERT_MEMBERSHIP_SQL = 'INSERT INTO membership (membership_admin_id, status, cur_year_renewed, ' +
    'view_online, renewal_sent, year_joined, address, city, state, zip, last_modified_date, last_modified_by) ' +
    'VALUES (?, "Active", 0, 1, 0, ?, ?, ?, ?, ?, CURDATE(), ?)';
export const PATCH_MEMBERSHIP_SQL = 'CALL sp_patch_membership(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

export async function insertMembership(req: PostNewMembershipRequest): Promise<number> {
    const values = [
        req.membershipAdminId,
        req.yearJoined,
        req.address,
        req.city,
        req.state,
        req.zip,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_MEMBERSHIP_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting membership in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting membership: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getMembershipList(status?: string): Promise<Membership[]> {
    let sql;
    let values: string[];
    if (typeof status !== 'undefined') {
        sql = GET_MEMBERSHIP_LIST_BY_STATUS_SQL;
        // if status is not in the map, it won't hurt to throw it in
        // anyway (and this makes testing easier)
        values = [MEMBERSHIP_STATUS_MAP.get(status) || status];
    } else {
        sql = GET_MEMBERSHIP_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting membership list: ${e}`);
        throw new Error('internal server error');
    }

    return _.map(results, (result) => ({
        membershipId: result.membership_id,
        membershipAdmin: result.membership_admin,
        status: result.status,
        curYearRenewed: result.cur_year_renewed[0],
        renewalSent: result.renewal_sent[0],
        yearJoined: result.year_joined,
        address: result.address,
        city: result.city,
        state: result.state,
        zip: result.zip,
        lastModifiedDate: result.last_modified_date,
        lastModifiedBy: result.last_modified_by,
    }));
}

export async function getMembership(id: number): Promise<Membership> {
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_MEMBERSHIP_SQL, values);
    } catch (e) {
        logger.error(`DB error getting membership: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        membershipId: results[0].membership_id,
        membershipAdmin: results[0].membership_admin,
        status: results[0].status,
        curYearRenewed: results[0].cur_year_renewed[0],
        renewalSent: results[0].renewal_sent[0],
        yearJoined: results[0].year_joined,
        address: results[0].address,
        city: results[0].city,
        state: results[0].state,
        zip: results[0].zip,
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
    };
}

export async function patchMembership(id: number, req: PatchMembershipRequest): Promise<void> {
    const values = [
        id,
        req.membershipAdminId,
        req.status,
        req.curYearRenewed,
        req.renewalSent,
        req.yearJoined,
        req.address,
        req.city,
        req.state,
        req.zip,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await pool.query<OkPacket>(PATCH_MEMBERSHIP_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching membership in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching membership: ${e}`);
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
