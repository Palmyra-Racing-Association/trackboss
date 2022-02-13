import { ErrorResponse } from './errorResponse';

export type Job = {
    jobId: number,
    member: string,
    event: string,
    jobDate: string,
    jobType: string,
    verified: boolean,
    verifiedDate: string,
    pointsAwarded: number,
    paid: boolean,
    paidDate: string,
    lastModifiedDate: string,
    lastModifiedBy: string
}

export type DeletedJob = {
    jobId: number
}

export type PostNewJobRequest = {
    memberId?: number,
    eventId?: number,
    jobTypeId: number,
    jobDate?: string,
    pointsAwarded?: number,
    verified?: boolean,
    verifiedDate? : string,
    paid?: boolean,
    paidDate?: string,
    modifiedBy: number
}

export type PostNewJobResponse = Job | ErrorResponse

export type GetJobRequest = {}

export type GetJobResponse = Job | ErrorResponse

export type PatchJobRequest = {
    memberId?: number,
    eventId?: number,
    jobTypeId?: number,
    jobDate?: string,
    pointsAwarded?: number,
    verified?: boolean,
    paid?: boolean,
    modifiedBy: number
}

export type PatchJobResponse = Job | ErrorResponse

export type PostCloneJobRequest = {}

export type PostCloneJobResponse = Job | ErrorResponse

export type DeleteJobRequest = {}

export type DeleteJobResponse = DeletedJob | ErrorResponse

export type GetJobListRequest = {}

export type GetJobListResponse = Job[] | ErrorResponse
