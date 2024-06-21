import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { EventType, PatchEventTypeRequest, PostNewEventTypeRequest } from '../typedefs/eventType';

export const GET_EVENT_TYPE_LIST_SQL =
'SELECT event_type_id, type, active, last_modified_by, last_modified_date FROM v_event_type order by type';
export const GET_EVENT_TYPE_SQL = `${GET_EVENT_TYPE_LIST_SQL} WHERE event_type_id = ?`;
export const INSERT_EVENT_TYPE_SQL =
    'INSERT INTO event_type (type, last_modified_by, last_modified_date, active) VALUES (?, ?, CURDATE(), 1)';
export const PATCH_EVENT_TYPE_SQL = 'CALL sp_patch_event_type (?, ?, ?, ?)';

export async function insertEventType(req: PostNewEventTypeRequest): Promise<number> {
    const values = [req.type, req.modifiedBy];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(INSERT_EVENT_TYPE_SQL, values);
    } catch (e: any) {
        if ('errno' in e) {
            switch (e.errno) {
                case 1048: // non-null violation, missing a non-nullable column
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
        [results] = await getPool().query<RowDataPacket[]>(GET_EVENT_TYPE_SQL, values);
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
        active: !!results[0].active[0],
        lastModifiedDate: results[0].last_modified_date,
        lastModifiedBy: results[0].last_modified_by,
        defaultEndTime: results[0].default_end,
        defaultStartTime: results[0].default_start,
    };
}

export async function getEventTypeList(): Promise<EventType[]> {
    const sql = GET_EVENT_TYPE_LIST_SQL;
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting event type list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        eventTypeId: result.event_type_id,
        type: result.type,
        lastModifiedBy: result.last_modified_by,
        lastModifiedDate: result.last_modified_date,
        active: !!result.active[0],
        defaultEndTime: result.default_end,
        defaultStartTime: result.default_start,
    }));
}

export async function patchEventType(id: number, req: PatchEventTypeRequest): Promise<void> {
    if (_.isEmpty(req)) {
        throw new Error('user input error');
    }
    const values = [id, req.type, req.active, req.modifiedBy];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_EVENT_TYPE_SQL, values);
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
