import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { Event, PatchEventRequest, PostNewEventRequest } from '../typedefs/event';

export const INSERT_EVENT_SQL = 'CALL sp_event_job_generation(?, ?, ?, ?)';
export const GET_EVENT_SQL = 'SELECT * FROM v_event WHERE event_id = ?';
export const GET_EVENT_LIST_SQL = `${GET_EVENT_SQL} WHERE date > ? AND date < ?`;
export const PATCH_EVENT_SQL = '';
export const DELETE_EVENT_SQL = '';

export async function insertEvent(req: PostNewEventRequest): Promise<number> {
    const values = [req.date, req.eventTypeId, req.eventName, req.eventDescription];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error inserting event: ${e}`);
        throw new Error('internal server error');
    }

    return result.insertId;
}

export async function getEventList(dateRange?: string): Promise<Event[]> {
    let sql;
    let values: string[];
    if (typeof dateRange !== 'undefined') {
        sql = GET_EVENT_LIST_SQL;
        values = [dateRange];
    } else {
        sql = GET_EVENT_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting event list: ${e}`);
        throw new Error('internal server error');
    }

    return results.map((result) => ({
        eventId: result.event_id,
        date: result.date,
        eventType: result.event_type,
        eventName: result.event_name,
        eventDescription: result.event_description,
    }));
}

export async function getEvent(id: number): Promise<Event> {
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error getting event: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        eventId: results[0].event_id,
        date: results[0].date,
        eventType: results[0].event_type,
        eventName: results[0].event_name,
        eventDescription: results[0].event_description,
    };
}

export async function patchEvent(id: number, req: PatchEventRequest): Promise<void> {
    const values = [id, req.date, req.eventName, req.eventDescription];
    // I dont think we should allow changing of event types?

    let result;
    try {
        [result] = await pool.query<OkPacket>(PATCH_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error patching bike: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function deleteEvent(id: number): Promise<void> {
    const values = [id];

    let result;
    try {
        [result] = await pool.query<OkPacket>(DELETE_EVENT_SQL, values);
    } catch (e) {
        logger.error(`DB error deleting event: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}
