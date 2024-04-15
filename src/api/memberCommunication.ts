import { Request, Response, Router } from 'express';
import AWS from 'aws-sdk';
import {
    getMemberCommunicationById, getMemberCommunications, insertMemberCommunication,
} from '../database/memberCommunication';
import { validateAdminAccess } from '../util/auth';
import logger from '../logger';
import { getMemberList, getMembersWithTag } from '../database/member';
import { MemberCommunication } from '../typedefs/memberCommunication';
import { getEnvironmentParameter } from '../util/environmentWrapper';

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
        // I add this here because we figure out what they are in this upcomign code block.
        communication.members = [];
        // use the base object type as a hashmap with any keys you want in there.
        // learned this trick ages ago.
        const uniqueRecipients : any = {};
        if (communication.selectedTags && (communication.selectedTags.length > 0)) {
            // I want array iteration here because I want things to be in order.
            // eslint-disable-next-line no-restricted-syntax
            for (const tag of communication.selectedTags) {
                // this is on purpose too
                // eslint-disable-next-line no-await-in-loop
                const membersWithTags = await getMembersWithTag(tag);
                membersWithTags.forEach((member) => {
                    uniqueRecipients[member.memberId] = (member.memberId, member);
                });
            }
            const uniqueRecipientIds = Object.keys(uniqueRecipients);
            uniqueRecipientIds.forEach((id: any) => {
                const memberRecord = uniqueRecipients[id];
                const paredDownRecord = {
                    firstName: memberRecord.firstName,
                    lastName: memberRecord.lastName,
                    email: memberRecord.email,
                    phone: memberRecord.phoneNumber,
                };
                communication.members?.push(paredDownRecord);
            });
        } else {
            const allMembers = await getMemberList({});
            const activeAdmins = allMembers.filter((member) => {
                const isAdmin = (member.membershipAdminId === member.memberId);
                return (isAdmin && member.active);
            });
            activeAdmins.forEach((member) => {
                communication?.members.push({
                    firstName: member.firstName,
                    lastName: member.lastName,
                    email: member.email,
                    phone: member.phoneNumber,
                });
            });
        }
        const response = await insertMemberCommunication(communication);
        // now stick the message in the respective SQS queue for further processing.
        const outboundQueueName = `trackboss-queue-${communication.mechanism}`;
        AWS.config.update({ region: process.env.AWS_REGION });
        const sqs = new AWS.SQS();

        logger.info(`sending communication id ${response.memberCommunicationId} to outbound queue`);
        const region = await getEnvironmentParameter('region');
        const account = await getEnvironmentParameter('account');
        const sqsUrl = `https://sqs.${region}.amazonaws.com/${account}/${outboundQueueName}`;
        sqs.sendMessage({
            MessageBody: JSON.stringify(response),
            QueueUrl: sqsUrl,
        }, (error, messageResult) => {
            if (error) {
                logger.error(`queue send failed for communication ${response.memberCommunicationId} due to `, error);
                logger.error(`The message with subject ${response.subject} will not be delivered.`);
                return;
            }
            logger.info(`Communication is ${response.memberCommunicationId} enqueued as ${messageResult.MessageId}`);
        });

        res.json(response);
    } catch (error: any) {
        logger.error(`Error at path ${req.path}`);
        logger.error(error);
        res.status(500);
    }
});

export default memberCommunication;
