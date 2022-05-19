import { ErrorResponse } from './errorResponse';

export type WorkPoints = {
    firstName?: string,
    lastName?: string,
    membershipType?: string,
    total: number
}

export type GetMemberWorkPointsRequest = Record<string, never>

export type GetMemberWorkPointsResponse = WorkPoints | ErrorResponse

export type GetMemberWorkPointsListResponse = WorkPoints[] | ErrorResponse

export type GetMembershipWorkPointsRequest = Record<string, never>

export type GetMembershipWorkPointsResponse = WorkPoints | ErrorResponse
