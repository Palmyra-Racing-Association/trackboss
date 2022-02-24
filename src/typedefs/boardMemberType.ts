import { ErrorResponse } from './errorResponse';

export type boardMemberType = {
    boardTypeId: number,
    title: string,
}

export type GetBoardMemberTypeRequest = {};

export type GetBoardMemberTypeResponse = boardMemberType | ErrorResponse;

export type PostNewBoardMemberTypeRequest = {
    title: string
}

export type PostNewBoardMemberTypeResponse = boardMemberType | ErrorResponse;

export type PatchBoardMemberTypeRequest = {
    boardTypeId: number,
    title: string
};

export type PatchBoardMemberTypeResponse = boardMemberType | ErrorResponse;

export type GetBoardMemberTypeListRequest = {};

export type GetBoardMemberTypeListResponse = boardMemberType[] | ErrorResponse;
