import { ErrorResponse } from './errorResponse';

export type WorkPoints = {
    total: number
}

export type GetMemberWorkPointsRequest = Record<string, never>

export type GetMemberWorkPointsResponse = WorkPoints | ErrorResponse

export type GetMembershipWorkPointsRequest = Record<string, never>

export type GetMembershipWorkPointsResponse = WorkPoints | ErrorResponse
