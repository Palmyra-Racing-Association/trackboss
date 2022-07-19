import { Request, Response, Router } from 'express';
import { sendAppConfirmationEmail } from '../util/email';
import {
    getMembershipApplication, getMembershipApplications, insertMembershipApplication,
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
        res.status(401);
        res.send({ reason: headerCheck.reason });
    } else {
        try {
            await verify(headerCheck.token, 'Admin');
        } catch (error: any) {
            logger.error('Error authorizing user token as admin', error);
            res.status(401);
            res.send(error);
        }
    }
}

membershipApplication.post('/', async (req: Request, res: Response) => {
    const application = req.body;
    application.receivedDate = new Date();
    logger.info(`Application received at ${application.receivedDate} for ${application.lastName}`);
    // eslint-disable-next-line max-len
    application.googleLink = `https://www.google.com/search?q=${application.firstName}+${application.lastName}+${application.city}+${application.state}`;
    const insertId = await insertMembershipApplication(application);
    application.id = insertId;
    await sendAppConfirmationEmail(application);
    res.send(application);
});

membershipApplication.get('/', async (req: Request, res: Response) => {
    await validateAdminAccess(req, res);
    const allApplications = await getMembershipApplications();
    res.send(allApplications);
});

membershipApplication.get('/:id', async (req: Request, res: Response) => {
    await validateAdminAccess(req, res);
    const id = parseInt(req.params.id, 10);
    const allApplications = await getMembershipApplication(id);
    res.send(allApplications);
});

export default membershipApplication;
