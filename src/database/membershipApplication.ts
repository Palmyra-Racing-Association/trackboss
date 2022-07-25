import { OkPacket, RowDataPacket } from 'mysql2';
import { getPool } from './pool';
import logger from '../logger';
import { MembershipApplication } from '../typedefs/membershipApplication';

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
        const applicationsQuery =
            'select membership_application_id, application_status, application_json from membership_application';
        [results] = await getPool()
            .query<RowDataPacket[]>(applicationsQuery);
    } catch (e) {
        logger.error(`DB error getting bike list: ${e}`);
        throw new Error('internal server error');
    }
    const applications : MembershipApplication[] = [];
    results.forEach((result) => {
        const app : MembershipApplication = result.application_json;
        app.id = result.membership_application_id;
        app.status = result.application_status;
        applications.push(app);
    });
    return applications;
}
