import _ from 'lodash';
import { OkPacket, RowDataPacket } from 'mysql2';

import logger from '../logger';
import { getPool } from './pool';
import { Bill, GenerateSingleBillRequest, GetBillListRequestFilters, WorkPointThreshold } from '../typedefs/bill';

export const GET_BILL_LIST_SQL = 'SELECT * FROM v_bill';
export const GET_THRESHOLD_SQL = 'SELECT * FROM point_threshold WHERE year = ?';
export const GENERATE_BILL_SQL =
    'INSERT INTO member_bill (generated_date, year, amount, amount_with_fee, membership_id, emailed_bill, ' +
    'cur_year_paid) VALUES (CURDATE(), YEAR(CURDATE()), ?, ?, ?, NULL, 0)';
export const PATCH_BILL_SQL = 'CALL sp_patch_bill (?, ?, ?)';

export async function generateBill(req: GenerateSingleBillRequest): Promise<number> {
    const values = [req.amount.toFixed(2), req.amountWithFee.toFixed(2), req.membershipId];

    let result;
    try {
        [result] = await getPool().query<OkPacket>(GENERATE_BILL_SQL, values);
    } catch (e) {
        // FK violations are technically possible, but membership IDs should only have
        // been recently grabbed from the database anyway - no chance for user error
        logger.error(`DB error generating bill: ${e}`);
        throw new Error('internal server error');
    }

    return result.insertId;
}

export async function getWorkPointThreshold(year: number): Promise<WorkPointThreshold> {
    const values = [year];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(GET_THRESHOLD_SQL, values);
    } catch (e) {
        logger.error(`DB error getting work point threshold: ${e}`);
        throw new Error('internal server error');
    }

    if (_.isEmpty(results)) {
        throw new Error('not found');
    }

    return {
        year: results[0].year,
        threshold: results[0].amount,
    };
}

export async function getBillList(filters: GetBillListRequestFilters): Promise<Bill[]> {
    let sql;
    let values: any[] = [];
    if (_.values(filters).find((filter) => typeof filter !== 'undefined')) {
        let dynamicSql = ' WHERE ';
        let counter = 0;
        if (typeof filters.membershipId !== 'undefined') {
            dynamicSql += 'membership_id = ? AND ';
            values[counter++] = filters.membershipId;
        }
        if (typeof filters.year !== 'undefined') {
            dynamicSql += 'year = ? AND ';
            values[counter++] = filters.year;
        }
        if (typeof filters.paymentStatus !== 'undefined') {
            if (filters.paymentStatus === 'outstanding') {
                dynamicSql += 'cur_year_paid = 0 AND ';
            }
            if (filters.paymentStatus === 'paid') {
                dynamicSql += 'cur_year_paid = 1 AND ';
            }
        }
        sql = GET_BILL_LIST_SQL + dynamicSql.slice(0, -4); // Slice the trailing AND
    } else {
        sql = GET_BILL_LIST_SQL;
        values = [];
    }

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting bill list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        billId: result.bill_id,
        generatedDate: result.generated_date,
        year: result.year,
        amount: result.amount,
        amountWithFee: result.amount_with_fee,
        membershipAdmin: result.membership_admin,
        membershipAdminEmail: result.membership_admin_email,
        emailedBill: result.emailed_bill,
        curYearPaid: !!result.cur_year_paid[0],
        dueDate: new Date((result.year + 1), 1, 15).toDateString(),
    }));
}

export async function markBillEmailed(id: number): Promise<void> {
    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_BILL_SQL, [id, 'CURDATE()', null]);
    } catch (e) {
        logger.error(`DB error marking bill as emailed: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function markBillPaid(id: number): Promise<void> {
    let result;
    try {
        [result] = await getPool().query<OkPacket>(PATCH_BILL_SQL, [id, null, 1]);
    } catch (e) {
        logger.error(`DB error marking bill as paid: ${e}`);
        throw new Error('internal server error');
    }

    if (result.affectedRows < 1) {
        throw new Error('not found');
    }
}

export async function cleanBilling(year: number, memberId?: number): Promise<number> {
    let param;
    let result;
    let sql;
    if (memberId) {
        sql = 'delete from member_bill where member_id = ? and year = ?';
        param = [memberId, year];
    } else {
        sql = 'delete from member_bill where year = ?';
        param = [year];
    }
    try {
        [result] = await getPool().query<OkPacket>(sql, param);
    } catch (e) {
        logger.error('DB error cleaning up bills', e);
        throw e;
    }
    logger.info(`billing cleanup for ${year}, ${result.affectedRows} bills cleaned up`);
    return result.affectedRows;
}
