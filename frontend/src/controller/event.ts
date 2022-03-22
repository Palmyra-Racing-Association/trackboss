import { generateHeaders, getEventMonthDay } from './utils';
// import { getTodaysDate } from './utils';
import {
    DeleteEventResponse,
    GetEventListResponse,
    GetEventResponse,
    PatchEventRequest,
    PatchEventResponse,
    PostNewEventRequest,
    PostNewEventResponse,
    Event,
} from '../../../src/typedefs/event';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';

function isEventList(res: Event[] | ErrorResponse): res is Event[] {
    return (res as Event[]) !== undefined;
}

export async function createEvent(token: string, eventData: PostNewEventRequest): Promise<PostNewEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventData),
    });
    return response.json();
}

// TODO: this is a mocked response for frontend development, replace once API is complete
export async function makeEvent(name: string, description: string, start: Date, end: Date, typeId: number) {
    // eslint-disable-next-line no-console
    console.debug({
        date: start,
        eventTypeId: typeId,
        eventName: name,
        eventDescription: description,
    });
}

export async function getEventList(token: string, listType?: string): Promise<GetEventListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token, listType),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getCalendarEvents(token: string) {
    const calendarEvents = await getEventList(token);
    if (isEventList(calendarEvents)) {
        return calendarEvents;
    }

    // else
    return undefined;
}

export async function getUpcomingEventData(token: string, listType: string) {
    const upcomingEvents = await getEventList(token, listType);

    if (isEventList(upcomingEvents)) {
        // + symbol here converts the dates to numbers, to allow for arithmetic comparison
        upcomingEvents.sort((e1: Event, e2: Event) => +new Date(e1.start) - +new Date(e2.start));

        const formattedEventDate = getEventMonthDay(upcomingEvents[0].start);
        upcomingEvents[0].start = formattedEventDate;
        return upcomingEvents[0];
    }

    // else
    return undefined;
}

export async function getEvent(token: string, eventID: number): Promise<GetEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEvent(
    token: string,
    eventID: number,
    eventData: PatchEventRequest,
): Promise<PatchEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventData),
    });
    return response.json();
}

export async function deleteEvent(token: string, eventID: number): Promise<DeleteEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
