import { Member } from './member';

export type CommunicationAudience = {
    audienceId: number,
    selectedTag: string,
    members: Member[],
}
