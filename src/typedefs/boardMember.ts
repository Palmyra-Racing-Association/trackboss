import { ErrorResponse } from './errorResponse';

export type boardMember = {
    boardId: number,
    title: string,
    year: number,
    memberId: number
}

export type GetBoardMemberRequest = Record<string, never>;

export type GetBoardMemberResponse = boardMember | ErrorResponse;

export type PostNewBoardMemberRequest = {
    boardMemberTitleId: number,
    year: number,
    memberId: number
}

export type PostNewBoardMemberResponse = boardMember | ErrorResponse;

export type PatchBoardMemberRequest = {
    boardMemberTitleId?: number,
    year?: number,
    memberId?: number
};

export type PatchBoardMemberResponse = boardMember | ErrorResponse;

export type GetBoardMemberListRequest = Record<string, never>;

export type GetBoardMemberListResponse = boardMember[] | ErrorResponse;
