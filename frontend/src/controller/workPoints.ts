import { generateHeaders } from './utils';
import {
    GetMembershipWorkPointsResponse,
    GetMemberWorkPointsResponse,
    WorkPoints,
} from '../../../src/typedefs/workPoints';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';

function isWorkPoints(res: WorkPoints | ErrorResponse): res is WorkPoints {
    return (res as WorkPoints) !== undefined;
}

export async function getWorkPointsByMember(token: string, memberId: number): Promise<GetMemberWorkPointsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getWorkPointsByMembership(token: string, membershipId: number):
                                                    Promise<GetMembershipWorkPointsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getWorkPointsTotal(token: string, membershipId: number) {
    const workPointsResponse = await getWorkPointsByMember(token, membershipId);
    if (isWorkPoints(workPointsResponse)) {
        return workPointsResponse.total;
    }

    // else
    return undefined;
}
