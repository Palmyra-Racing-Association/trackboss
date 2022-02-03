import { ErrorResponse } from './errorResponse';

export type WorkPoints = {
    total: number
}

export type GetMemberWorkPointsRequest = {}

export type GetMemberWorkPointsResponse = WorkPoints | ErrorResponse

export type GetMembershipWorkPointsRequest = {}

export type GetMembershipWorkPointsResponse = WorkPoints | ErrorResponse
