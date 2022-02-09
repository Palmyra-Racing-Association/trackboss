import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { EventType, PatchEventTypeRequest, PostNewEventTypeRequest } from '../typedefs/eventType';

export const GET_EVENT_TYPE_LIST_SQL =
'SELECT event_type_id, type, active, last_modified_by,' +
    'DATE_FORMAT(last_modified_date, "%Y-%m-%d") AS last_modified_date FROM event_type';
export const GET_EVENT_TYPE_SQL = `${GET_EVENT_TYPE_LIST_SQL} WHERE event_type_id = ?`;
export const INSERT_EVENT_TYPE_SQL =
    'INSERT INTO event_type (type, last_modified_by, last_modified_date, active) VALUES (?, ?, CURDATE(), 1)';
export const PATCH_EVENT_TYPE_SQL = 'CALL sp_patch_event_type (?, ?, ?, ?, CURDATE())';

export async function insertEventType(req: PostNewEventTypeRequest): Promise<number> {
    const values = [req.type, req.modifiedBy];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_EVENT_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error inserting event type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error inserting event type: ${e}`);
                    throw new Error('internal server error');
            }
        } else {
            // this should not happen - errors from query should always have 'errno' field
            throw e;
        }
    }

    return result.insertId;
}

export async function getEventType(id: number): Promise<EventType> {
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_EVENT_TYPE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting event type: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        eventTypeId: results[0].event_type_id,
        type: results[0].type,
        active: results[0].active[0],
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
    };
}

export async function patchEventType(id: number, req: PatchEventTypeRequest): Promise<void> {
    const values = [id, req.type, req.active, req.modifiedBy];

    let result;
    try {
        [result] = await pool.query<OkPacket>(PATCH_EVENT_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1451: // FK violation - referenced somewhere else
                case 1452: // FK violation - referenced is missing
                    logger.error(`User error patching event type in DB: ${e}`);
                    throw new Error('user input error');
                default:
                    logger.error(`DB error patching event type: ${e}`);
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
