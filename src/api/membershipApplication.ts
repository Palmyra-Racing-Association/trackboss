import { Request, Response, Router } from 'express';
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
    res.send(application);
});

export default membershipApplication;
