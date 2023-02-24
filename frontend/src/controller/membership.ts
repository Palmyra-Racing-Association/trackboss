import { generateHeaders } from './utils';
import {
    GetMembershipListResponse,
    GetMembershipResponse,
    PatchMembershipRequest,
    PatchMembershipResponse,
    PostNewMembershipRequest,
    PostNewMembershipResponse,
    PostRegisterMembershipResponse,
    PostRegisterMembershipRequest,
} from '../../../src/typedefs/membership';

export async function createMembership(
    token: string,
    memberData: PostNewMembershipRequest,
): Promise<PostNewMembershipResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMembershipList(token: string, listType?: string): Promise<GetMembershipListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/list?status=${listType}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getMembership(token: string, membershipID: number): Promise<GetMembershipResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/${membershipID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateMembership(
    token: string,
    membershipID: number,
    memberData: PatchMembershipRequest,
): Promise<PatchMembershipResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/${membershipID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function registerMembership(
    registrationData: PostRegisterMembershipRequest,
): Promise<PostRegisterMembershipResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/register`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
    });
    return response.json();
}
