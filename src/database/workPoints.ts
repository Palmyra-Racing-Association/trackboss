import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';
import { WorkPoints } from 'src/typedefs/workPoints';
import logger from '../logger';
import { getPool } from './pool';

export const GET_WORK_POINTS_BY_MEMBER_SQL =
    'select total_points from v_work_points_by_member where member_id = ? and year = ?';
export const GET_WORK_POINTS_BY_MEMBERSHIP_SQL =
    'select total_points from v_current_member_points where membership_id = ? and year = ?';

export async function getWorkPointsByMember(memberId: number, year: number): Promise<WorkPoints> {
    const values = [memberId, year];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_WORK_POINTS_BY_MEMBER_SQL, values);
    } catch (e) {
        logger.error(`DB error getting work points for member: ${e}`);
        throw new Error('internal server error');
    }
    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        total: results[0].total_points,
    };
}

export async function getWorkPointsByMembership(membershipId: number, year: number): Promise<WorkPoints> {
    const values = [membershipId, year];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_WORK_POINTS_BY_MEMBERSHIP_SQL, values);
    } catch (e) {
        logger.error(`DB error getting work points for membership: ${e}`);
        throw new Error('internal server error');
    }

    let total = 0;
    if (!_.isEmpty(results)) {
        total = results[0].total_points;
    }

    return {
        total,
    };
}

export async function getWorkPointsList(year: number) : Promise<WorkPoints[]> {
    const sql = 'select * from v_current_member_points where year = ? or year is null order by last_name, first_name';
    let results = [];
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, [year]);
    } catch (error) {
        logger.error('Error accessing current member points list');
        logger.error(error);
        throw error;
    }
    return results.map((result) => ({
        firstName: result.first_name,
        lastName: result.last_name,
        membershipType: result.membership_type,
        total: result.total_points,
    }));
}
