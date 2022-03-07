import { ErrorResponse } from './errorResponse';

export type Event = {
    eventId: number,
    start: string,
    end: string,
    eventType: string,
    title: string,
    eventDescription: string
}

export type DeletedEvent = {
    eventId: number
}

export type PostNewEventRequest = {
    startDate?: string,
    endDate?: string,
    eventTypeId: number,
    eventName?: string,
    eventDescription?: string
}

export type PostNewEventResponse = Event | ErrorResponse

export type GetEventRequest = Record<string, never>

export type GetEventResponse = Event | ErrorResponse

export type PatchEventRequest = {
    startDate?: string,
    endDate?: string,
    eventTypeId?: number,
    eventName?: string,
    eventDescription?: string
}

export type PatchEventResponse = Event | ErrorResponse

export type DeleteEventRequest = Record<string, never>

export type DeleteEventResponse = DeletedEvent | ErrorResponse

export type GetEventListRequest = Record<string, never>

export type GetEventListResponse = Event[] | ErrorResponse
