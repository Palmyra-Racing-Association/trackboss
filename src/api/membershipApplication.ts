import { Request, Response, Router } from 'express';
import { sendAppConfirmationEmail } from '../util/email';
// eslint-disable-next-line max-len
import { getMembershipApplication, getMembershipApplications, insertMembershipApplication } from '../database/membershipApplication';
import logger from '../logger';
import { checkHeader } from '../util/auth';

const membershipApplication = Router();

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
    const { authorization } = req.headers;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        res.send({ reason: headerCheck.reason });
    } else {
        const allApplications = await getMembershipApplications();
        res.send(allApplications);
    }
});

membershipApplication.get('/:id', async (req: Request, res: Response) => {
    const { authorization } = req.headers;
    const headerCheck = checkHeader(authorization);
    if (!headerCheck.valid) {
        res.status(401);
        res.send({ reason: headerCheck.reason });
    } else {
        const id = parseInt(req.params.id, 10);
        const allApplications = await getMembershipApplication(id);
        res.send(allApplications);
    }
});


export default membershipApplication;
