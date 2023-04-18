import { generateHeaders } from './utils';

import { MemberCommunication } from '../../../src/typedefs/memberCommunication';

export async function getCommunications(token: string) : Promise<MemberCommunication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/memberCommunication`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function createCommunication(token: string, req: MemberCommunication) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/memberCommunication/new`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(req),
    });
    return response.json();
}
