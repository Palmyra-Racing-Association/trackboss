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

export async function getWorkPointsPercentage(token: string, membershipId: number) {
    const workPointsResponse = await getWorkPointsByMember(token, membershipId);

    // TODO: bugfix on server side?
    const thresholdResponse = {
        year: 2021,
        threshold: 100,
    };

    if (isWorkPoints(workPointsResponse)) {
        return Math.ceil((workPointsResponse.total / thresholdResponse.threshold) * 100);
    }

    // else
    return undefined;
}
