import { RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { PaidLabor } from '../typedefs/paidLabor';

export async function getPaidLabor(): Promise<PaidLabor[]> {
    const sql = 'select * from paid_labor';
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting paid labor list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        paidLaborId: result.paid_labor_id,
        firstName: result.first_name,
        lastName: result.last_name,
        businessName: result.business_name,
        phoneNumber: result.phone,
        email: result.email,
    }));
}

export async function getPaidLaborById(id: number): Promise<PaidLabor> {
    const sql = 'select * from paid_labor where paid_labor_id = ?';
    const values: any[] = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting paid labor list: ${e}`);
        throw new Error('internal server error');
    }
    return {
        paidLaborId: results[0].paid_labor_id,
        firstName: results[0].first_name,
        lastName: results[0].last_name,
        businessName: results[0].business_name,
        phoneNumber: results[0].phone_number,
        email: results[0].email,
    };
}
