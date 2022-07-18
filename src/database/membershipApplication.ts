import { OkPacket, RowDataPacket } from 'mysql2';
import { getPool } from './pool';
import logger from '../logger';
import { MembershipApplication } from '../typedefs/membershipApplication';

// eslint-disable-next-line import/prefer-default-export
export async function insertMembershipApplication(membershipApplication: any): Promise<number> {
    const values = ['PENDING_REVIEW', membershipApplication.email, JSON.stringify(membershipApplication)];
    let result;
    // eslint-disable-next-line max-len
    const insertSql = 'insert into membership_application (application_status, application_email, application_json) values (?, ?, ?)';
    try {
        [result] = await getPool().query<OkPacket>(insertSql, values);
        logger.info(`Inserted application with id ${result.insertId}`);
    } catch (e: any) {
        logger.error(e);
        throw e;
    }
    return result.insertId;
}

export async function getMembershipApplications() : Promise<MembershipApplication[]> {
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select application_json from membership_application');
    } catch (e) {
        logger.error(`DB error getting bike list: ${e}`);
        throw new Error('internal server error');
    }
    const applications : MembershipApplication[] = [];
    results.forEach((result) => {
        applications.push(result.application_json);
    });
    return applications;
}

export async function getMembershipApplication(id: number) : Promise<MembershipApplication> {
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select application_json from membership_application');
    } catch (e) {
        logger.error(`DB error getting bike list: ${e}`);
        throw new Error('internal server error');
    }
    const applications = results[0].application_json;
    return applications;
}
