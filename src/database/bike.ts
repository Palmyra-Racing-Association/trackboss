import _ from 'lodash';
import mysql from 'mysql2/promise';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import config from './config';
import { Bike, PostNewBikeRequest } from '../typedefs/bike';

export async function insertBike(req: PostNewBikeRequest): Promise<number> {
    const conn = await mysql.createConnection(config);
    const sql = 'INSERT INTO member_bikes (year, make, model, membership_id) VALUES (?, ?, ?, ?)';
    const values = [req.year, req.make, req.model, req.membershipId];

    let result;
    try {
        [result] = await conn.query<OkPacket>(sql, values);
    } catch (e) {
        logger.error(`DB error inserting bike: ${e}`);
        throw new Error('internal server error');
    } finally {
        conn.end();
    }

    return result.insertId;
}

export async function getBike(id: number): Promise<Bike> {
    const conn = await mysql.createConnection(config);
    const sql = 'SELECT bike_id, year, make, model, membership_admin FROM v_bike WHERE bike_id = ?';
    const values = [id];

    let results;
    try {
        [results] = await conn.query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting bike: ${e}`);
        throw new Error('internal server error');
    } finally {
        conn.end();
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        bikeId: results[0].bike_id,
        year: results[0].year,
        make: results[0].make,
        model: results[0].model,
        membershipAdmin: results[0].membership_admin,
    };
}
