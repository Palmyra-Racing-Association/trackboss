import { ErrorResponse } from './errorResponse';

export type EventType = {
    eventTypeId: number,
    type: string,
    active: boolean,
    lastModifiedDate: Date,
    lastModifiedBy: string
}

export type PostNewEventTypeRequest = {
    type: string,
    modifiedBy: number
}

export type PostNewEventTypeResponse = EventType | ErrorResponse

export type GetEventTypeRequest = {}

export type GetEventTypeResponse = EventType | ErrorResponse

export type PatchEventTypeRequest = {
    type?: string,
    active?: boolean,
    modifiedBy: number
}

export type PatchEventTypeResponse = EventType | ErrorResponse

export type GetEventTypeListRequest = {}

export type GetEventTypeListResponse = EventType[] | ErrorResponse
