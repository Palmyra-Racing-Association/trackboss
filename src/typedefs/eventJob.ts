import { ErrorResponse } from './errorResponse';

export type EventJob = {
    eventJobId: number,
    eventType: string,
    jobType: string,
    count: number
}

export type DeletedEventJob = {
    eventJobId: number
}

export type PostNewEventJobRequest = {}

export type PostNewEventJobResponse = EventJob | ErrorResponse

export type GetEventJobRequest = {}

export type GetEventJobResponse = EventJob | ErrorResponse

export type PatchEventJobRequest = {}

export type PatchEventJobResponse = EventJob | ErrorResponse

export type DeleteEventJobRequest = {}

export type DeleteEventJobResponse = DeletedEventJob | ErrorResponse
