import { ErrorResponse } from './errorResponse';

export type MemberType = {
    memberTypeId: number,
    type: string,
    baseDuesAmt: number
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
