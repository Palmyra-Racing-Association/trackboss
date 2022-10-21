import { Request, Response, Router } from 'express';
import { sendAppConfirmationEmail } from '../util/email';
import {
    getMembershipApplications, insertMembershipApplication, updateApplicationStatus,
} from '../database/membershipApplication';
import logger from '../logger';
import { checkHeader, verify } from '../util/auth';

const membershipApplication = Router();

/**
 * All in one function to validate administrative access for a given user token. This will throw
 * an error if the token is not valid.  Callers can call this and then process the rest of the endpoint normally, as
 * this is a "catch all" function that does the work so you don't have to.
 *
 */
async function validateAdminAccess(req: Request, res: Response) {
    const { authorization } = req.headers;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        throw new Error(headerCheck.reason);
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
        } catch (error: any) {
            logger.error('Error authorizing user token as admin', error);
            throw error;
        }
    }
}

/**
 * Shared function to update the status in the database.  Yay reusablity!
 * @param req request
 * @param res response
 * @param status status
 */
const sendApplicationStatus = async (req: Request, res: Response, status: string) => {
    await validateAdminAccess(req, res);
    const id = parseInt(req.params.id, 10);
    const { internalNotes, applicantNotes } = req.body;
    const updatedApplication = await updateApplicationStatus(id, status, internalNotes, applicantNotes);
    res.send(updatedApplication);
};

membershipApplication.post('/', async (req: Request, res: Response) => {
    try {
        const application = req.body;
        application.receivedDate = (new Date()).toLocaleString('en-US');
        logger.info(`Application received at ${application.receivedDate} for ${application.lastName}`);
        // eslint-disable-next-line max-len
        application.googleLink = `https://www.google.com/search?q=${application.firstName}+${application.lastName}+${application.city}+${application.state}`;
        const insertId = await insertMembershipApplication(application);
        application.id = insertId;
        await sendAppConfirmationEmail(application);
        res.send(application);
    } catch (error: any) {
        logger.error(error);
        res.status(500);
        res.send(error);
    }
});

membershipApplication.get('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const allApplications = await getMembershipApplications();
        res.send(allApplications);
    } catch (error: any) {
        logger.error(error);
        res.status(500);
        res.send('Unable to process application due to error');
    }
});

membershipApplication.post('/accept/:id', async (req: Request, res: Response) => {
    try {
        await sendApplicationStatus(req, res, 'Accepted');
        // get the application, and convert the primary member to a member. This call will create a
        // Cognito user, and send an email to the user letting them know they have one.

        // once you have the member, create a membership with the member is the membership admin

        // now send a welcome email to the member.
    } catch (error: any) {
        logger.error(error);
        res.status(500);
        res.send('Unable to process application due to error');
    }
});

membershipApplication.post('/reject/:id', async (req: Request, res: Response) => {
    try {
        // update the last_modified_date field in here.
        await sendApplicationStatus(req, res, 'Rejected');
        // send an email saying they were rejected, with the application_notes_shared as the primary
        // field in the email
    } catch (error: any) {
        logger.error(error);
        res.status(500);
        res.send('Unable to process application due to error');
    }
});

membershipApplication.post('/review/:id', async (req: Request, res: Response) => {
    try {
        await sendApplicationStatus(req, res, 'Review');
    } catch (error: any) {
        logger.error(error);
        res.status(500);
        res.send('Unable to process application due to error');
    }
});

export default membershipApplication;
