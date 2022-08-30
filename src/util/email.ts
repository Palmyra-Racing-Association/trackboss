import AWS from 'aws-sdk';
import { RowDataPacket } from 'mysql2';
import logger from '../logger';
import { getPool } from '../database/pool';
import { getBoardMemberList } from '../database/boardMember';

async function getEmailById(purpose: string) {
    const values = [purpose];
    let results;
    try {
        [results] = await getPool().query<RowDataPacket[]>('select * from emails where purpose = ?', values);
    } catch (e: any) {
        logger.error(`DB error gettting email with ID ${purpose}`, e);
    }
    const bccList : string[] = [];
    const emails = results?.map((result) => ({
        purpose: result.purpose,
        subject: result.subject,
        text: result.text,
        to: '',
        bcc: bccList,
    })) || [];
    return emails[0];
}

export async function sendTextEmail(email: any) {
    AWS.config.update({ region: process.env.AWS_REGION });
    const clubEmail = process.env.CLUB_EMAIL || '';
    const ses = new AWS.SES();
    const emailParams = {
        Destination: {
            ToAddresses: [email.to],
            CcAddresses: [clubEmail],
            BccAddresses: email.bcc,
        },
        Message: {
            Subject: { Data: email.subject },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: email.text,
                },
            },
        },
        ReplyToAddresses: [clubEmail],
        Source: 'admin@palmyramx.com',
    };
    try {
        await ses.sendEmail(emailParams).promise();
    } catch (error: any) {
        logger.error('Unable to send email via SES');
        logger.error(error);
    }
}

export async function sendAppConfirmationEmail(application: any) {
    const confirmEmail = await getEmailById('APP_CONFIRMATION');
    confirmEmail.text = confirmEmail.text.replace(/firstName/, application.firstName);
    confirmEmail.text = confirmEmail.text.replace(/lastName/, application.lastName);
    confirmEmail.text = confirmEmail.text.replace(/appId/, application.id);

    confirmEmail.to = application.email;
    const boardMembers = await getBoardMemberList((new Date().getFullYear().toString()));
    boardMembers.forEach((member) => confirmEmail.bcc.push(member.email || ''));
    await sendTextEmail(confirmEmail);
    logger.info(`application emails sent for application ${application.id}`);
}
