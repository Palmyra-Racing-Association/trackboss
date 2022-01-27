import { ErrorResponse } from './errorResponse';

export type MemberType = {
    memberTypeId: number,
    type: string,
    baseDuesAmt: number
}

export type GetMemberTypeRequest = {};

export type GetMemberTypeResponse = MemberType | ErrorResponse;

export type PatchMemberRequest = {
    memberTypeId?: number,
    type?: string,
    baseDuesAmt?: number
};

export type PatchMemberResponse = MemberType | ErrorResponse;

export type GetMemberTypeListRequest = {};

export type GetMemberTypeListResponse = MemberType[] | ErrorResponse;
