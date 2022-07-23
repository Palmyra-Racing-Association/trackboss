import { generateHeaders } from './utils';

import { MembershipApplication } from '../../../src/typedefs/membershipApplication';

// eslint-disable-next-line import/prefer-default-export
export async function getMembershipApplications(token: string): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
export async function getMembershipApplication(token: string, id: number): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
