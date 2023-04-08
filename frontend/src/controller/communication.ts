import { generateHeaders } from './utils';

import { MemberCommunication } from '../../../src/typedefs/memberCommunication';

// eslint-disable-next-line import/prefer-default-export
export async function getCommunications(token: string) : Promise<MemberCommunication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
