import { CommunicationAudience } from './communicationAudience';

export type MemberCommunication = {
    memberCommunicationId: number,
    subject: string,
    mechanism: string,
    senderId: number,
    text: string,
    recipientAudienceId: number,
};
