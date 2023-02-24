import { ErrorResponse } from './errorResponse';

export type MemberType = {
    memberTypeId: number,
    type: string,
    baseDuesAmt: number,
    // count is an optional parameter for pages that want to know how many of each type we have.
    count?: number,
}

export type GetMemberTypeRequest = Record<string, never>;

export type GetMemberTypeResponse = MemberType | ErrorResponse;

export type PatchMemberTypeRequest = {
    type?: string,
    baseDuesAmt?: number
};

export type PatchMemberTypeResponse = MemberType | ErrorResponse;

export type GetMemberTypeListRequest = Record<string, never>;

export type GetMemberTypeListResponse = MemberType[] | ErrorResponse;
