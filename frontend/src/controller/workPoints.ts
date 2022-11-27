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

export async function getWorkPointsByMember(
    token: string,
    memberId: number,
    year?: number,
): Promise<GetMemberWorkPointsResponse> {
    if (typeof year === 'undefined') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}?year=${year}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getWorkPointsByMembership(token: string, membershipId: number, year?: number):
    Promise<GetMembershipWorkPointsResponse> {
    if (typeof year === 'undefined') {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // eslint-disable-next-line max-len
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}?year=${year}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });

    return response.json();
}

export async function getWorkPointsTotal(token: string, membershipId: number) {
    const workPointsResponse = await getWorkPointsByMembership(token, membershipId);
    if (isWorkPoints(workPointsResponse)) {
        return workPointsResponse.total;
    }

    // else
    return undefined;
}

export async function getMemberPointsExcel(token: string): Promise<Blob> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/list/excel`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.blob();
}

export async function getEligibleVoters(token: string): Promise<Blob> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list/voterEligibility/excel`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.blob();
}
