import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { Event, PatchEventRequest, PostNewEventRequest } from '../typedefs/event';

export const INSERTED_EVENT_ID_OUT = '@event_id';
export const INSERT_EVENT_SQL = `CALL sp_event_job_generation(?, ?, ?, ?, ?, ${INSERTED_EVENT_ID_OUT})`;
export const GET_INSERTED_EVENT_ID_SQL = `SELECT ${INSERTED_EVENT_ID_OUT}`;
export const GET_EVENT_LIST_SQL = 'SELECT * FROM v_event';
export const GET_EVENT_LIST_DATERANGE_SQL = `${GET_EVENT_LIST_SQL} WHERE start >= ? AND start <= ? order by start`;
export const GET_EVENT_SQL = `${GET_EVENT_LIST_SQL} WHERE event_id = ?`;
export const PATCH_EVENT_SQL = 'CALL sp_patch_event(?, ?, ?, ?, ?)';
export const DELETE_EVENT_SQL = 'CALL sp_delete_event(?)';

export async function insertEvent(req: PostNewEventRequest): Promise<number> {
    const values = [req.startDate, req.endDate, req.eventTypeId, req.eventName, req.eventDescription];

    // Use a single connection for sequential queries with SQL variables
    // (variables are session-scoped)
    const conn = await getPool().getConnection();
    try {
        try {
            await conn.query<OkPacket>(INSERT_EVENT_SQL, values);
        } catch (e: any) {
            if ('errno' in e) {
                switch (e.errno) {
                    case 1048: // non-null violation, missing a non-nullable column
                    case 1452: // FK violation - referenced is missing
                        logger.error(`User error inserting event in DB: ${e}`);
                        throw new Error('user input error');
                    default:
                        logger.error(`DB error inserting event: ${e}`);
                        throw new Error('internal server error');
                }
            } else {
                // this should not happen - errors from query should always have 'errno' field
                throw e;
            }
        }

        let results;
        try {
            [results] = await conn.query<RowDataPacket[]>(GET_INSERTED_EVENT_ID_SQL);
        } catch (e) {
            logger.error(`DB error getting event ID after creation: ${e}`);
            throw new Error('internal server error');
        }

        return results[0][INSERTED_EVENT_ID_OUT];
    } finally {
        conn.release();
    }
}

export async function getEventList(startDate?: string, endDate?: string): Promise<Event[]> {
    let sql;
    let values: string[];
    let sDate: string;
    let eDate: string;
    if (typeof startDate !== 'undefined' || typeof endDate !== 'undefined') {
        if (typeof startDate !== 'undefined') {
            sDate = startDate;
        } else {
            sDate = '1990-01-01';
        }
        if (typeof endDate !== 'undefined') {
            eDate = endDate;
        } else {
            eDate = '2999-01-01';
        }
        sql = GET_EVENT_LIST_DATERANGE_SQL;
        values = [sDate, eDate];
    } else {
        sql = GET_EVENT_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting event list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        eventId: result.event_id,
        start: result.start,
        end: result.end,
        eventType: result.event_type,
        title: result.title,
        eventDescription: result.event_description,
    }));
}

export async function getEvent(id: number): Promise<Event> {
    const values = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error getting event: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        eventId: results[0].event_id,
        start: results[0].start,
        end: results[0].end,
        eventType: results[0].event_type,
        title: results[0].title,
        eventDescription: results[0].event_description,
    };
}

export async function getClosestEvent(): Promise<Event> {
    let results;
    try {
        [results] = await getPool()
            .query<RowDataPacket[]>('select * from v_event where start >= now() order by start limit 1');
    } catch (e) {
        logger.error(`DB error getting event: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        eventId: results[0].event_id,
        start: results[0].start,
        end: results[0].end,
        eventType: results[0].event_type,
        title: results[0].title,
        eventDescription: results[0].event_description,
    };
}

export async function patchEvent(id: number, req: PatchEventRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [id, req.startDate, req.endDate, req.eventName, req.eventDescription];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error patching event: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        logger.info('this is happening');
        throw new Error('not found');
    }
}

export async function deleteEvent(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(DELETE_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting event: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
