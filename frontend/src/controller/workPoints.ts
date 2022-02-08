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

// TODO: mocked response for frontend development. change when api is complete
export async function getWorkPointsPercentage() {
    const workPointsResponse = {
        total: 10,
    };

    const thresholdResponse = {
        year: 2021,
        threshold: 15,
    };

    // this can probably stay
    const percentage = (workPointsResponse.total / thresholdResponse.threshold) * 100;
    return Math.ceil(percentage);
}
