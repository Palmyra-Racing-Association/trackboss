import { Request, Response, Router } from 'express';
import AWS from 'aws-sdk';
import { insertMembershipApplication } from '../database/membershipApplication';
import logger from '../logger';

const membershipApplication = Router();

membershipApplication.post('/', async (req: Request, res: Response) => {
    const application = req.body;
    application.receivedDate = new Date();
    logger.info(`Application received at ${application.receivedDate} for ${application.lastName}`);
    // eslint-disable-next-line max-len
    application.googleLink = `https://www.google.com/search?q=${application.firstName}+${application.lastName}+${application.city}+${application.state}`;
    const insertId = await insertMembershipApplication(application);
    application.id = insertId;
    const applicationEmail = application.email;
    AWS.config.update({ region: 'us-east-1' });
    const clubEmail = process.env.CLUB_EMAIL || '';
    const ses = new AWS.SES();
    const emailParams = {
        Destination: {
            ToAddresses: [application.email],
            CcAddresses: [clubEmail],
        },
        Message: {
            Subject: { Data: 'Your Palmyra Racing Association Application has been received!' },
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data:
                    `Hello ${application.firstName} ${application.lastName},
                    This email is your confirmation that your application to Palmyra Racing Association has been
                    received for the coming season.  We will follow up with you on any next steps.

                    Applications will be reviewed in mid February of next year, at which point, you will be 
                    contacted about the status of your application.
                    Your application ID is ${application.id}.
                    Thanks, 
                    PRA Board
                    `,
                },
            },
        },
        ReplyToAddresses: [clubEmail],
        Source: 'admin@palmyramx.com',
    };
    await ses.sendEmail(emailParams).promise();
    res.send(application);
});

export default membershipApplication;
