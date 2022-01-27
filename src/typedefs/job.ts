import { ErrorResponse } from './errorResponse';

export type Job = {
    jobId: number,
    member: string,
    event: string,
    jobDate: Date,
    jobType: string,
    verified: boolean,
    verifiedDate: Date,
    pointsAwarded: number,
    paid: boolean,
    paidDate: Date,
    lastModifiedDate: Date,
    lastModifiedBy: string
}

export type DeletedJob = {
    jobId: number
}

export type PostNewJobRequest = {}

export type PostNewJobResponse = Job | ErrorResponse

export type GetJobRequest = {}

export type GetJobResponse = Job | ErrorResponse

export type PatchJobRequest = {}

export type PatchJobResponse = Job | ErrorResponse

export type PostCloneJobRequest = {}

export type PostCloneJobResponse = Job | ErrorResponse

export type DeleteJobRequest = {}

export type DeleteJobResponse = DeletedJob | ErrorResponse

export type GetJobListRequest = {}

export type GetJobListResponse = Job[] | ErrorResponse
