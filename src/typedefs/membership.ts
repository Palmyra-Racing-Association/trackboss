import { ErrorResponse } from './errorResponse';

export type Membership = {
    membershipId: number,
    membershipAdmin: string,
    active: boolean,
    curYearRenewed: boolean,
    renewalSent: boolean,
    yearJoined: number,
    address: string,
    city: string
    state: string,
    zip: string,
    lastModifiedDate: Date,
    lastModifiedBy: string
}

export type PostNewMembershipRequest = {
    membershipAdminId: number,
    yearJoined: number,
    address: string,
    city: string,
    state: string,
    zip: string,
    modifiedBy: number
}

export type PostNewMembershipResponse = Membership | ErrorResponse

export type GetMembershipRequest = {}

export type GetMembershipResponse = Membership | ErrorResponse

export type PatchMembershipRequest = {
    membershipAdminId?: number,
    active?: boolean,
    curYearRenewed?: boolean,
    renewalSent: boolean,
    yearJoined?: number,
    address?: string,
    city?: string
    state?: string,
    zip?: string
    modifiedBy: number
}

export type PatchMemberResponse = Membership | ErrorResponse

export type GetMembershipListRequest = {}

export type GetMembershipListResponse = Membership[] | ErrorResponse

export type PostRegisterNewMembershipRequest = {
    memberTypeId: number,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: Date,
    address: string,
    city: string,
    state: string,
    zip: string
}

export type PostRegisterMembershipResponse = {
    memberType: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: Date,
    address: string,
    city: string,
    state: string,
    zip: string
} | ErrorResponse
