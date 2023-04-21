export type MemberCommunication = {
    memberCommunicationId?: number,
    subject: string,
    mechanism: string,
    senderId: number,
    senderName?: string,
    text: string,
    selectedTags: string[],
    sentDate?: Date,
};
