import AWS from 'aws-sdk';
import logger from '../logger';
import { MemberCommunication } from '../typedefs/memberCommunication';

export default async function publishCommunicationSqs(communication : MemberCommunication) {
    // now stick the message in the respective SQS queue for further processing.
    const outboundQueueName = `trackboss-queue-${communication.mechanism}`;
    AWS.config.update({ region: process.env.AWS_REGION });
    const sqs = new AWS.SQS();

    logger.info(`sending communication ${communication.memberCommunicationId} to outbound queue`);
    const region = process.env.AWS_REGION;
    const account = process.env.ACCOUNT;
    const sqsUrl = `https://sqs.${region}.amazonaws.com/${account}/${outboundQueueName}`;
    let result = {};
    sqs.sendMessage({
        MessageBody: JSON.stringify(communication),
        QueueUrl: sqsUrl,
    }, (error, messageResult) => {
        if (error) {
            logger.error(`queue send failed for communication ${communication.memberCommunicationId} due to `, error);
            logger.error(`The message with subject ${communication.subject} will not be delivered.`);
            return;
        }
        result = messageResult;
        logger.info(`Communication is ${communication.memberCommunicationId} enqueued as ${messageResult.MessageId}`);
    });
    return result;
}
