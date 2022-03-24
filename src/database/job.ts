import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import { Job, PatchJobRequest, PostNewJobRequest, GetJobListRequestFilters } from 'src/typedefs/job';

import logger from '../logger';
import { getPool } from './pool';

export const GET_JOB_LIST_SQL = 'SELECT * FROM v_job';
export const GET_JOB_SQL = `${GET_JOB_LIST_SQL} WHERE job_id = ?`;
export const INSERT_JOB_SQL = 'INSERT INTO job (member_id, event_id, job_type_id, job_start_date, job_end_date, ' +
     ' last_modified_date, verified, verified_date, points_awarded, paid, paid_date, last_modified_by) ' +
     'VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?, ?, ?)';
export const PATCH_JOB_SQL = 'CALL sp_patch_job(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const DELETE_JOB_SQL = 'DELETE FROM job WHERE job_id = ?';

export async function insertJob(req: PostNewJobRequest): Promise<number> {
    const values = [req.memberId, req.eventId, req.jobTypeId, req.jobStartDate, req.jobEndDate, req.verified,
        req.verifiedDate, req.pointsAwarded, req.paid, req.paidDate, req.modifiedBy];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_JOB_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting job in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting job: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getJobList(filters: GetJobListRequestFilters): Promise<Job[]> {
    let sql;
    let values: any[] = [];
    if (!_.isEmpty(filters)) {
        let dynamicSql = ' WHERE ';
        let counter = 0;
        if (typeof filters.assignmentStatus !== 'undefined') {
            if (filters.assignmentStatus === 1) {
                dynamicSql += 'member IS NOT NULL AND ';
            } else {
                dynamicSql += 'member IS NULL AND ';
            }
        }
        if (typeof filters.verificationStatus !== 'undefined') {
            dynamicSql += 'verified = ? AND ';
            values[counter++] = filters.verificationStatus;
        }
        if (typeof filters.memberId !== 'undefined') {
            dynamicSql += 'member_id = ? AND ';
            values[counter++] = filters.memberId;
        }
        if (typeof filters.membershipId !== 'undefined') {
            dynamicSql += 'membership_id = ? AND ';
            values[counter++] = filters.membershipId;
        }
        if (typeof filters.eventId !== 'undefined') {
            dynamicSql += 'event_id = ? AND ';
            values[counter++] = filters.eventId;
        }
        if (typeof filters.startDate !== 'undefined') {
            dynamicSql += 'job_date >= ? AND ';
            values[counter++] = filters.startDate;
        }
        if (typeof filters.endDate !== 'undefined') {
            dynamicSql += 'job_date <= ? AND ';
            values[counter++] = filters.endDate;
        }
        sql = GET_JOB_LIST_SQL + dynamicSql.slice(0, -4); // Slice the trailing AND
    } else {
        sql = GET_JOB_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting job list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        jobId: result.job_id,
        member: result.member,
        eventId: result.event_id,
        event: result.event,
        start: result.start,
        end: result.end,
        title: result.title,
        verified: !!result.verified[0],
        verifiedDate: result.verified_date,
        pointsAwarded: result.points_awarded,
        paid: !!result.verified[0],
        paidDate: result.paid_date,
        lastModifiedDate: result.last_modified_date,
        lastModifiedBy: result.last_modified_by,
    }));
}

export async function getJob(id: number): Promise<Job> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_JOB_SQL, values);
    } catch (e) {
        logger.error(`DB error getting job: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        jobId: results[0].job_id,
        member: results[0].member,
        eventId: results[0].event_id,
        event: results[0].event,
        start: results[0].start,
        end: results[0].end,
        title: results[0].title,
        verified: !!results[0].verified[0],
        verifiedDate: results[0].verified_date,
        pointsAwarded: results[0].points_awarded,
        paid: !!results[0].paid[0],
        paidDate: results[0].paid_date,
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
    };
}

export async function patchJob(id: number, req: PatchJobRequest): Promise<void> {
    const values = [id, req.memberId, req.eventId, req.jobTypeId, req.jobStartDate, req.jobEndDate,
        req.pointsAwarded, req.verified, req.paid, req.modifiedBy];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_JOB_SQL, values);
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

export async function deleteJob(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(DELETE_JOB_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting job: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
