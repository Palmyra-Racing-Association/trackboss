import { OkPacket } from 'mysql2';
import { getPool } from './pool';
import logger from '../logger';

// eslint-disable-next-line import/prefer-default-export
export async function insertMembershipApplication(membershipApplication: any): Promise<number> {
    const values = ['PENDING_REVIEW', JSON.stringify(membershipApplication)];
    let result;
    const insertSql = 'insert into membership_application (application_status, application_json) values (?, ?)';
    try {
        [result] = await getPool().query<OkPacket>(insertSql, values);
        logger.info(`Inserted application with id ${result.insertId}`);
    } catch (e: any) {
        logger.error(e);
        throw e;
    }
    return result.insertId;
}
