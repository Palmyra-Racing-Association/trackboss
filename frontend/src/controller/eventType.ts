import generateHeaders from './utils';

export async function createEventType(token: string, eventTypeData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventTypeData),
    });
    return response.json();
}

export async function getEventType(token: string, eventTypeId: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/${eventTypeId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEventType(token: string, eventTypeId: number, eventTypeData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/${eventTypeId}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventTypeData),
    });
    return response.json();
}

export async function getEventTypeList(token: string) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventType/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
