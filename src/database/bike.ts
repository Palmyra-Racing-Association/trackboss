import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import pool from './pool';
import { Bike, PostNewBikeRequest } from '../typedefs/bike';

export const INSERT_BIKE_SQL = 'INSERT INTO member_bikes (year, make, model, membership_id) VALUES (?, ?, ?, ?)';
export const GET_BIKE_SQL = 'SELECT bike_id, year, make, model, membership_admin FROM v_bike WHERE bike_id = ?';

export async function insertBike(req: PostNewBikeRequest): Promise<number> {
    //const sql = 'INSERT INTO member_bikes (year, make, model, membership_id) VALUES (?, ?, ?, ?)';
    const values = [req.year, req.make, req.model, req.membershipId];

    let result;
    try {
        [result] = await pool.query<OkPacket>(INSERT_BIKE_SQL, values);
    } catch (e) {
        logger.error(`DB error inserting bike: ${e}`);
        throw new Error('internal server error');
    }

    return result.insertId;
}

export async function getBike(id: number): Promise<Bike> {
    //const sql = 'SELECT bike_id, year, make, model, membership_admin FROM v_bike WHERE bike_id = ?';
    const values = [id];

    let results;
    try {
        [results] = await pool.query<RowDataPacket[]>(GET_BIKE_SQL, values);
    } catch (e) {
        logger.error(`DB error getting bike: ${e}`);
        throw new Error('internal server error');
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
