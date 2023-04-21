import { Request, Response, Router } from 'express';
import {
    getMemberCommunicationById, getMemberCommunications, insertMemberCommunication,
} from '../database/memberCommunication';
import { validateAdminAccess } from '../util/auth';
import logger from '../logger';
import { getMembersWithTag } from '../database/member';
import { MemberCommunication } from '../typedefs/memberCommunication';
import { Member } from '../typedefs/member';

const memberCommunication = Router();

memberCommunication.get('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const allCommunications = await getMemberCommunications();
        res.send(allCommunications);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

memberCommunication.get('/:communicationId', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const id = Number(req.params.communicationId);
        const singleCommunication = await getMemberCommunicationById(id);
        res.send(singleCommunication);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

memberCommunication.post('/', async (req: Request, res: Response) => {
    try {
        await validateAdminAccess(req, res);
        const communication : MemberCommunication = req.body;
        const response = await insertMemberCommunication(communication);
        const uniqueRecipients = new Map<number, Member>();
        // I want array iteration here because I want things to be in order.
        // eslint-disable-next-line no-restricted-syntax
        for (const tag of communication.selectedTags) {
            // this is on purpose too
            // eslint-disable-next-line no-await-in-loop
            const membersWithTags = await getMembersWithTag(tag);
            membersWithTags.forEach((member) => {
                uniqueRecipients.set(member.memberId, member);
            });
        }
        res.json(response);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

export default memberCommunication;
