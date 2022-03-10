import { ErrorResponse } from './errorResponse';

export type BoardMemberType = {
    boardTypeId: number,
    title: string,
}

export type GetBoardMemberTypeRequest = Record<string, never>;

export type GetBoardMemberTypeResponse = BoardMemberType | ErrorResponse;

export type PostNewBoardMemberTypeRequest = {
    title: string
}

export type PostNewBoardMemberTypeResponse = BoardMemberType | ErrorResponse;

export type PatchBoardMemberTypeRequest = {
    boardTypeId: number,
    title: string
};

export type PatchBoardMemberTypeResponse = BoardMemberType | ErrorResponse;

export type GetBoardMemberTypeListRequest = Record<string, never>;

export type GetBoardMemberTypeListResponse = BoardMemberType[] | ErrorResponse;

export type DeleteBoardMemberTypeRequest = Record<string, never>;

export type DeleteBoardMemberTypeResponse = {
    boardMemberTypeId: number,
} | ErrorResponse;
