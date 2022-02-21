import { generateHeaders } from './utils';
import {
    GetEventTypeListResponse,
    GetEventTypeResponse,
    PatchEventTypeRequest,
    PatchEventTypeResponse,
    PostNewEventTypeRequest,
    PostNewEventTypeResponse,
} from '../../../src/typedefs/eventType';

export async function createEventType(
    token: string,
    eventTypeData: PostNewEventTypeRequest,
): Promise<PostNewEventTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventTypeData),
    });
    return response.json();
}

export async function getEventType(token: string, eventTypeId: number): Promise<GetEventTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/${eventTypeId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEventType(
    token: string,
    eventTypeId: number,
    eventTypeData: PatchEventTypeRequest,
): Promise<PatchEventTypeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/${eventTypeId}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventTypeData),
    });
    return response.json();
}

export async function getMockedEventTypeList() {
    return [
        {
            eventTypeId: 0,
            type: 'Race',
            active: true,
            lastmodifiedDate: '2022-02-10',
            lastModifiedBy: 'Me :D',
        },
        {
            eventTypeId: 1,
            type: 'Meeting',
            active: true,
            lastmodifiedDate: '2022-02-10',
            lastModifiedBy: 'Me :D',
        },
    ];
}

export async function getEventTypeList(token: string): Promise<GetEventTypeListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
