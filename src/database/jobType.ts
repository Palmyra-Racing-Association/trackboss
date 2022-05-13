import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { JobType, PatchJobTypeRequest, PostNewJobTypeRequest } from '../typedefs/jobType';

export const GET_JOB_TYPE_LIST_SQL = 'SELECT * FROM v_job_type';
export const GET_JOB_TYPE_SQL = `${GET_JOB_TYPE_LIST_SQL} WHERE job_type_id = ?`;
export const INSERT_JOB_TYPE_SQL = 'INSERT INTO job_type (title, point_value, cash_value, job_day_number, active, ' +
    'reserved, online, meal_ticket, sort_order, last_modified_date, last_modified_by)' +
    'VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?, CURDATE(), ?)';
export const PATCH_JOB_TYPE_SQL = 'CALL sp_patch_job_type (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

const jobDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function insertJobType(req: PostNewJobTypeRequest): Promise<number> {
    const values = [
        req.title,
        req.pointValue,
        req.cashValue,
        req.jobDayNumber,
        req.reserved,
        req.online,
        req.mealTicket,
        req.sortOrder,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_JOB_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1048: // non-null violation, missing a non-nullable column
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting job type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting job type: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getJobType(id: number): Promise<JobType> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_JOB_TYPE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting job type: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        jobTypeId: results[0].job_type_id,
        title: results[0].title,
        pointValue: results[0].point_value,
        cashValue: results[0].cash_value,
        jobDayNumber: results[0].job_day_number,
        jobDay: jobDays[results[0].job_day_number],
        active: !!results[0].active[0],
        reserved: !!results[0].reserved[0],
        online: !!results[0].online[0],
        mealTicket: !!results[0].meal_ticket[0],
        sortOrder: results[0].sort_order,
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
    };
}

export async function getJobTypeList(): Promise<JobType[]> {
    const sql = GET_JOB_TYPE_LIST_SQL;
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting job type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        jobTypeId: result.job_type_id,
        title: result.title,
        pointValue: result.point_value,
        cashValue: result.cash_value,
        jobDayNumber: result.job_day_number,
        jobDay: jobDays[result.job_day_number],
        active: !!result.active[0],
        reserved: !!result.reserved[0],
        online: !!result.online[0],
        mealTicket: !!result.meal_ticket[0],
        sortOrder: result.sort_order,
        lastModifiedDate: result.last_modified_date,
        lastModifiedBy: result.last_modified_by,
    }));
}

export async function getJobTypesEventList(eventTypeName : string) : Promise<JobType[]> {
    const sql = `select jt.*, ej.count from job_type jt, event_job ej, event_type et
    where et.type = ? and jt.active = 1 and ej.event_type_id = et.event_type_id and
    ej.job_type_id = jt.job_type_id order by jt.job_day_number, jt.job_type_id`;

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, [eventTypeName]);
    } catch (e) {
        logger.error(`DB error getting job type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        jobTypeId: result.job_type_id,
        title: result.title,
        pointValue: result.point_value,
        cashValue: result.cash_value,
        jobDayNumber: result.job_day_number,
        jobDay: jobDays[result.job_day_number],
        active: !!result.active[0],
        reserved: !!result.reserved[0],
        online: !!result.online[0],
        mealTicket: !!result.meal_ticket[0],
        sortOrder: result.sort_order,
        count: result.count,
        lastModifiedDate: result.last_modified_date,
        lastModifiedBy: result.last_modified_by,
    }));
}

export async function patchJobType(id: number, req: PatchJobTypeRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }

    const values = [
        id,
        req.title,
        req.pointValue,
        req.cashValue,
        req.jobDayNumber,
        req.reserved,
        req.online,
        req.mealTicket,
        req.sortOrder,
        req.active,
        req.modifiedBy,
    ];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_JOB_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching job type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching job type: ${e}`);
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
