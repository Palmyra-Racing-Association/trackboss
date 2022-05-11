import { BoardMember } from './boardMember';
import { ErrorResponse } from './errorResponse';

export type Member = {
    memberId: number,
    membershipId: number,
    membershipAdmin: string,
    uuid: string,
    active: boolean,
    memberTypeId: number,
    memberType: string,
    membershipType: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: string,
    dateJoined: string,
    address: string,
    city: string,
    state: string,
    zip: string,
    lastModifiedDate: string,
    lastModifiedBy: string,
    boardMemberData? : BoardMember // optional field to be used only by the frontend to store data
}

export type PostNewMemberRequest = {
    membershipId?: number,
    uuid?: string,
    memberTypeId: number,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    occupation?: string,
    email?: string,
    birthdate?: string,
    dateJoined?: string,
    modifiedBy: number
}

export type PostNewMemberResponse = Member | ErrorResponse;

export type GetMemberRequest = Record<string, never>;

export type GetMemberResponse = Member | ErrorResponse;

export type PatchMemberRequest = {
    membershipId?: number,
    uuid?: string,
    active?: boolean,
    memberTypeId?: number,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    occupation?: string,
    email?: string,
    birthdate?: string,
    dateJoined?: string,
    modifiedBy: number
}

export type PatchMemberResponse = Member | ErrorResponse;

export type GetMemberListRequest = Record<string, never>

export type GetMemberListResponse = Member[] | ErrorResponse;

export type GetMemberListFilters = {
    type?: string,
    membershipId?: number
}
