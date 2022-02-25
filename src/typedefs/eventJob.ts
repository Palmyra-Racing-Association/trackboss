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

export type PostNewEventJobRequest = {
    eventTypeId: number,
    jobTypeId: number,
    count: number
}

export type PostNewEventJobResponse = EventJob | ErrorResponse

export type GetEventJobRequest = Record<string, never>

export type GetEventJobResponse = EventJob | ErrorResponse

export type PatchEventJobRequest = {
    eventTypeId?: number,
    jobTypeId?: number,
    count?: number
}

export type PatchEventJobResponse = EventJob | ErrorResponse

export type DeleteEventJobRequest = Record<string, never>

export type DeleteEventJobResponse = DeletedEventJob | ErrorResponse
