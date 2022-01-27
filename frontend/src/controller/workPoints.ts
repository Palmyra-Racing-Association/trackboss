import generateHeaders from './utils';
import { GetMembershipWorkPointsResponse, GetMemberWorkPointsResponse } from '../../../src/typedefs/workPoints';

export async function getByMember(token: string, memberId: number): Promise<GetMemberWorkPointsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getByMembership(token: string, membershipId: number): Promise<GetMembershipWorkPointsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
