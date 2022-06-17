import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { EventJob, PatchEventJobRequest, PostNewEventJobRequest } from '../typedefs/eventJob';

export const GET_EVENT_JOB_SQL = 'SELECT * FROM v_event_job WHERE event_job_id = ?';
export const INSERT_EVENT_JOB_SQL = 'INSERT INTO event_job (event_type_id, job_type_id, count) VALUES (?, ?, ?)';
export const PATCH_EVENT_JOB_SQL = 'CALL sp_patch_event_job(?, ?, ?, ?)';
export const DELETE_EVENT_JOB_SQL = 'DELETE FROM event_job WHERE event_job_id = ?';

export async function insertEventJob(req: PostNewEventJobRequest): Promise<number> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [req.eventTypeId, req.jobTypeId, req.count];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_EVENT_JOB_SQL, values);
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
        [results] = await getPool().query<RowDataPacket[]>(GET_EVENT_JOB_SQL, values);
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
        eventTypeId: results[0].event_type_id,
        jobTypeId: results[0].job_type_id,
        jobType: results[0].job_type,
        count: results[0].count,
    };
}

export async function updateJobsOnEventJob(id: number, req: PatchEventJobRequest): Promise<void> {
    let results;
    try {
        const countSql = `select distinct(event), event_id, job_type_id, 
            count(*) job_count, (?)-count(*) difference
            from v_job where 
            event_type_id = ? and job_type_id = ? and start > now()
            group by event`;
        [results] = await getPool().query<RowDataPacket[]>(countSql, [req.count, req.eventTypeId, req.jobTypeId]);
        results.forEach((row) => {
            const jobCountDiff = row.difference;
            if (jobCountDiff > 0) {
                console.log('add jobs!');
            } else if (jobCountDiff < 0) {
                console.log('remove jobs!');
            } else {
                console.log('it is the same we do nothing!');
            }
        });
    } catch (e: any) {
        logger.error('unable to update jobs on event job change', e);
    }
}

export async function patchEventJob(id: number, req: PatchEventJobRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [id, req.eventTypeId, req.jobTypeId, req.count];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_EVENT_JOB_SQL, values);
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
    await updateJobsOnEventJob(id, req);
}

export async function deleteEventJob(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        // get the job right before deleting it so we know what it is. it's a
        // ghooooooooooost job.
        const eventJob = await getEventJob(id);
        [result] = await getPool().query<OkPacket>(DELETE_EVENT_JOB_SQL, values);
        const [deleteJobsResult] = await getPool()
            .query<OkPacket>('delete from job where job_type_id = ? and job_start_date > now()', [eventJob.jobTypeId]);
        logger.info(`removed job id ${id} from jobs table`);
        logger.info(`${deleteJobsResult.affectedRows} rows in jobs affected`);
    } catch (e) {
        logger.error(`DB error deleting event-job: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
