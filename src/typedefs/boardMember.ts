import { ErrorResponse } from './errorResponse';

export type BoardMember = {
    boardId: number,
    title: string,
    titleId: number,
    year: number,
    memberId: number,
    firstName?: string,
    lastName?: string,
    email?: string,
}

export type GetBoardMemberRequest = Record<string, never>;

export type GetBoardMemberResponse = BoardMember | ErrorResponse;

export type PostNewBoardMemberRequest = {
    boardMemberTitleId: number,
    year: number,
    memberId: number
}

export type PostNewBoardMemberResponse = BoardMember | ErrorResponse;

export type PatchBoardMemberRequest = {
    boardMemberTitleId?: number,
    year?: number,
    memberId?: number
};

export type PatchBoardMemberResponse = BoardMember | ErrorResponse;

export type GetBoardMemberListRequest = Record<string, never>;

export type GetBoardMemberListResponse = BoardMember[] | ErrorResponse;

export type DeleteBoardMemberRequest = Record<string, never>;

export type DeleteBoardMemberResponse = {
    boardMemberId: number,
} | ErrorResponse;
