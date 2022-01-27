import generateHeaders from './utils';

export async function createEventJob(token: string, eventJobData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventJobData),
    });
    return response.json();
}

export async function getEventJob(token: string, eventJobId: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEventJob(token: string, eventJobId: number, eventJobData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventJobData),
    });
    return response.json();
}

export async function deleteEventJob(token: string, eventJobId: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
