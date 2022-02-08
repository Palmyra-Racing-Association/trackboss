import { generateHeaders } from './utils';
import {
    DeleteEventResponse,
    GetEventListResponse,
    GetEventResponse,
    PatchEventRequest,
    PatchEventResponse,
    PostNewEventRequest,
    PostNewEventResponse,
} from '../../../src/typedefs/event';

export async function createEvent(token: string, eventData: PostNewEventRequest): Promise<PostNewEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventData),
    });
    return response.json();
}

export async function getEventList(token: string, listType?: string): Promise<GetEventListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
            method: 'GET',
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

// TODO: this is a mocked response for frontend development, replace once API is completed
export async function getMostRecentEventData() {
    // const todayString = getTodaysDate();
    // const upcomingEvents = await getEventList('TestToken', todayString);
    const upcomingEvents = [
        {
            event_id: 0,
            date: '2022-02-07',
            event_type: 'string',
            event_name: 'Work Day',
            event_description: 'string',
        },
        {
            event_id: 1,
            date: '2022-02-07',
            event_type: 'string',
            event_name: 'string',
            event_description: 'string',
        },
    ];
    return upcomingEvents[0]; // Assuming that the API will return the list sorted by date
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
