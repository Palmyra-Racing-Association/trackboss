import { OkPacket, RowDataPacket } from 'mysql2';
import { MemberCommunication } from '../typedefs/memberCommunication';

import logger from '../logger';
import { getPool } from './pool';

export async function getMemberCommunications(): Promise<MemberCommunication[]> {
    const sql = 'select * from member_communication';
    const values: string[] = [];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member communications list: ${e}`);
        throw new Error('internal server error');
    }
    return results.map((result) => ({
        memberCommunicationId: result.member_communication_id,
        subject: result.subject,
        mechanism: result.mechanism,
        senderId: result.sender_id,
        text: result.text,
        recipientAudienceId: result.audience_id,
    }));
}

export async function getMemberCommunicationById(id :number) : Promise<MemberCommunication> {
    const sql = 'select * from member_communication where member_communication_id = ?';
    const values: number[] = [id];

    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>(sql, values);
    } catch (e) {
        logger.error(`DB error getting member communications list: ${e}`);
        throw new Error('internal server error');
    }
    return {
        memberCommunicationId: results[0].member_communication_id,
        subject: results[0].subject,
        mechanism: results[0].mechanism,
        senderId: results[0].sender_id,
        text: results[0].text,
        recipientAudienceId: results[0].audience_id,
    };
}

export async function insertMemberCommunication(communication: MemberCommunication) : Promise<number> {
    const values: any[] = [communication.subject, communication.senderId, communication.text,
        communication.mechanism, communication.recipientAudienceId,
    ];
    let result;
    // eslint-disable-next-line max-len
    const insertSql = 'insert into member_communication (subject, sender_id, text, mechanism, audience_id) values (?, ?, ?, ?, ?)';
    try {
        [result] = await getPool().query<OkPacket>(insertSql, values);
        logger.info(`Inserted application with id ${result.insertId}`);
    } catch (e: any) {
        logger.error(e);
        throw e;
    }
    return result.insertId;
}
