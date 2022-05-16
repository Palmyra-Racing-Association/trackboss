import { generateHeaders } from './utils';
import {
    DeleteEventJobResponse,
    GetEventJobResponse,
    PatchEventJobRequest,
    PatchEventJobResponse,
    PostNewEventJobRequest,
    PostNewEventJobResponse,
} from '../../../src/typedefs/eventJob';

export async function createEventJob(
    token: string,
    eventJobData: PostNewEventJobRequest,
): Promise<PostNewEventJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventJobData),
    });
    return response.json();
}

export async function getEventJob(token: string, eventJobId: number): Promise<GetEventJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEventJob(
    token: string,
    eventJobId: number,
    eventJobData: PatchEventJobRequest,
): Promise<PatchEventJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventJobData),
    });
    return response.json();
}

export async function deleteEventJob(token: string, eventJobId: number): Promise<DeleteEventJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/eventJob/${eventJobId}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
