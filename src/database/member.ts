import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { GetMemberListFilters, Member, PatchMemberRequest, PostNewMemberRequest } from '../typedefs/member';
import { createCognitoUser } from '../util/cognito';

// Map the API values for the member types to the DB values
export const MEMBER_TYPE_MAP = new Map([
    ['admin', 'Admin'],
    ['membershipAdmin', 'Membership Admin'],
    ['member', 'Member'],
    ['paidLaborer', 'Paid Laborer'],
]);

export const GET_MEMBER_LIST_SQL = 'SELECT * FROM v_member';
export const GET_MEMBER_SQL = `${GET_MEMBER_LIST_SQL} WHERE member_id = ?`;
export const GET_MEMBER_UUID_SQL = `${GET_MEMBER_LIST_SQL} WHERE uuid = ?`;
export const INSERT_MEMBER_SQL = 'INSERT INTO member (membership_id, uuid, member_type_id, first_name, last_name, ' +
    'phone_number, occupation, email, birthdate, date_joined, last_modified_date, last_modified_by, active) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, 1)';
export const PATCH_MEMBER_SQL = 'CALL sp_patch_member(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const GET_VALID_ACTORS_SQL = 'select member_id from pradb.member m where member_id=? or (m.member_type_id=2 ' +
    'and m.member_id=(select ms.membership_admin_id from pradb.member m left join pradb.membership ms on ' +
    'm.membership_id=ms.membership_id where member_id=?)) or m.member_type_id=1';

export async function insertMember(req: PostNewMemberRequest): Promise<number> {
    if (req.email) {
        logger.info(`Creating new user for email ${req.email} on membership ${req.membershipId}`);
        try {
            const isMembershipAdmin = (req.memberTypeId === 8);
            const uuid = await createCognitoUser(req.email, isMembershipAdmin);
            req.uuid = uuid;
            logger.info(`Successfully created ${req.email} in cognito as ${uuid}`);
        } catch (error: any) {
            logger.error(`Failure creating ${req.email} in cognito.  Continuing on trackboss database side`);
            logger.error(error);
        }
    }
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
        [result] = await getPool().query<OkPacket>(INSERT_MEMBER_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1048: // non-null violation, missing a non-nullable column
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

export async function getMemberList(filters: GetMemberListFilters): Promise<Member[]> {
    let sql;
    let values: any[] = [];
    if (!_.isEmpty(filters)) {
        let dynamicSql = ' WHERE ';
        let counter = 0;
        if (typeof filters.type !== 'undefined') {
            dynamicSql += 'member_type = ? AND ';
            // if type is not in the map, it won't hurt to throw it in
            // anyway (and this makes testing easier)
            values[counter++] = MEMBER_TYPE_MAP.get(filters.type) || filters.type;
        }
        if (typeof filters.membershipId !== 'undefined') {
            dynamicSql += 'membership_id = ? AND ';
            values[counter++] = filters.membershipId;
        }
        sql = GET_MEMBER_LIST_SQL + dynamicSql.slice(0, -4); // slice the trailing AND
    } else {
        sql = GET_MEMBER_LIST_SQL;
        values = [];
    }
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        memberId: result.member_id,
        membershipId: result.membership_id,
        firstName: result.first_name,
        lastName: result.last_name,
        membershipAdmin: result.membership_admin,
        membershipAdminId: result.membership_admin_id,
        isBoardMember: !!result.board_title_id,
        uuid: result.uuid,
        active: !!result.active[0],
        memberTypeId: result.member_type_id,
        memberType: result.member_type,
        membershipType: result.membership_type,
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

export async function getMember(searchParam: string): Promise<Member> {
    const id = Number(searchParam);
    let sql;
    let values;
    let results;
    if (Number.isNaN(id)) {
        // uuid search
        values = [searchParam];
        sql = GET_MEMBER_UUID_SQL;
    } else {
        values = [id];
        sql = GET_MEMBER_SQL;
    }

    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        memberId: results[0].member_id,
        membershipId: results[0].membership_id,
        firstName: results[0].first_name,
        lastName: results[0].last_name,
        membershipAdmin: results[0].membership_admin,
        membershipAdminId: results[0].membership_admin_id,
        isBoardMember: !!results[0].board_title_id,
        uuid: results[0].uuid,
        active: (results[0].active > 0),
        memberTypeId: results[0].member_type_id,
        memberType: results[0].member_type,
        membershipType: results[0].membership_type,
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

export async function getMemberByPhone(phone: string): Promise<Member> {
    let results;
    try {
        const sql = 'SELECT * FROM pradb.v_member where phone_number = ?';
        [results] = await getPool().query<RowDataPacket[]>(sql, [phone]);
    } catch (e) {
        logger.error(e);
        throw e;
    }
    return {
        memberId: results[0].member_id,
        membershipId: results[0].membership_id,
        firstName: results[0].first_name,
        lastName: results[0].last_name,
        membershipAdmin: results[0].membership_admin,
        membershipAdminId: results[0].membership_admin_id,
        isBoardMember: !!results[0].board_title_id,
        uuid: results[0].uuid,
        active: true,
        memberTypeId: results[0].member_type_id,
        memberType: results[0].member_type,
        membershipType: results[0].membership_type,
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

export async function getMemberByEmail(email: string): Promise<any> {
    let results;
    try {
        const sql = `SELECT * FROM pradb.v_member where email like '%${email}%'`;
        [results] = await getPool().query<RowDataPacket[]>(sql, [email]);
    } catch (e) {
        logger.error(e);
        throw e;
    }
    let memberWithEmail = {};
    if (results?.length > 0) {
        memberWithEmail = {
            memberId: results[0].member_id,
            membershipId: results[0].membership_id,
            firstName: results[0].first_name,
            lastName: results[0].last_name,
            membershipAdmin: results[0].membership_admin,
            membershipAdminId: results[0].membership_admin_id,
            uuid: results[0].uuid,
            active: true,
            memberTypeId: results[0].member_type_id,
            memberType: results[0].member_type,
            membershipType: results[0].membership_type,
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
    return memberWithEmail;
}

export async function patchMember(id: string, req: PatchMemberRequest): Promise<void> {
    if (_.isEmpty(req)) { // empty request
        throw new Error('user input error');
    }
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
        [result] = await getPool().query<OkPacket>(PATCH_MEMBER_SQL, values);
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

export async function getValidActors(member: number): Promise<number[]> {
    const values = [member, member];
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_VALID_ACTORS_SQL, values);
    } catch (e) {
        logger.error(`DB error getting valid actors: ${e}`);
        throw new Error('internal server error');
    }
    if (_.isEmpty(results)) {
        throw new Error('not found');
    }
    return _.map(results, (result) => result.member_id);
}

export async function deleteFamilyMember(memberId: number): Promise<number> {
    // remove the member but only if they are a sub member. Magic numberism here, fix it later.
    const sql =
        'delete from member where member_id = ? and member_type_id = 9';
    const values = [memberId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(sql, values);
    } catch (e) {
        logger.error(`DB error deleting event: ${e}`);
        throw new Error('internal server error');
    }
    return result.affectedRows;
}
