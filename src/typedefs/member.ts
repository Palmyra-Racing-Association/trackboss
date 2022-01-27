import { ErrorResponse } from './errorResponse';

export type Member = {
    memberId: number,
    membershipAdmin: string,
    uuid: string,
    active: boolean,
    memberType: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: Date,
    dateJoined: Date,
    address: string,
    city: string,
    state: string,
    zip: string,
    lastModifiedDate: Date,
    lastModifiedBy: string
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
    birthdate?: Date,
    dateJoined?: Date,
    modifiedBy: number
}

export type PostNewMemberResponse = Member | ErrorResponse;

export type GetMemberRequest = {};

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
    birthdate?: Date,
    dateJoined?: Date,
    modifiedBy: number
}

export type PatchMemberResponse = Member | ErrorResponse;

export type GetMemberListRequest = {}

export type GetMemberListResponse = Member[] | ErrorResponse;
