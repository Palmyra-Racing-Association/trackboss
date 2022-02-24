import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { EventJob, PatchEventJobRequest, PostNewEventJobRequest } from '../typedefs/eventJob';

export const GET_EVENT_JOB_SQL = 'SELECT * FROM v_event_job WHERE event_job_id = ?';
export const INSERT_EVENT_JOB_SQL = 'INSERT INTO event_job (event_type_id, job_type_id, count) VALUES (?, ?, ?)';
export const PATCH_EVENT_JOB_SQL = 'CALL sp_patch_event_job(?, ?, ?, ?)';
export const DELETE_EVENT_JOB_SQL = 'DELETE FROM event_job WHERE event_job_id = ?';

export async function insertEventJob(req: PostNewEventJobRequest): Promise<number> {
    const values = [req.eventTypeId, req.jobTypeId, req.count];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_EVENT_JOB_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting event-job in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting event-job: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getEventJob(id: number): Promise<EventJob> {
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_EVENT_JOB_SQL, values);
    } catch (e) {
        logger.error(`DB error getting event-job: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        eventJobId: results[0].event_job_id,
        eventType: results[0].event_type,
        jobType: results[0].job_type,
        count: results[0].count,
    };
}

export async function patchEventJob(id: number, req: PatchEventJobRequest): Promise<void> {
    const values = [id, req.eventTypeId, req.jobTypeId, req.count];

    let result;
    try {
        [result] = await pool.query<OkPacket>(PATCH_EVENT_JOB_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching event-job in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching event-job: ${e}`);
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

export async function deleteEventJob(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await pool.query<OkPacket>(DELETE_EVENT_JOB_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting event-job: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
