import { generateHeaders } from './utils';

import {
    GetMemberListResponse,
    GetMemberResponse,
    Member,
    PatchMemberRequest,
    PatchMemberResponse,
    PostNewMemberRequest,
    PostNewMemberResponse,
} from '../../../src/typedefs/member';

export async function createMember(token: string, memberData: PostNewMemberRequest): Promise<PostNewMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/new`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMember(token: string, memberId: number): Promise<GetMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export function getFamilyMembers(token: string, membershipId: number): Promise<GetMemberListResponse> {
    return fetch(`${process.env.REACT_APP_API_URL}/api/member/list?membershipId=${membershipId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    }).then((response) => response.json()).then((data) => data as GetMemberListResponse);
}

export async function getMemberList(token: string, listType?: string): Promise<GetMemberListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list?status=${listType}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateMember(
    token: string,
    memberID: number,
    memberData: PatchMemberRequest,
): Promise<PatchMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMembersByMembership(token: string, membershipId: number): Promise<Member[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list?membershipId=${membershipId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getMemberByEmail(token: string, email: string): Promise<Member> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/email/${email}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function memberExistsByEmail(email: string): Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/email/exists/${email}`, {
        method: 'GET',
        mode: 'cors',
    });
    return response.json();
}

export async function resetMemberPassword(token: string, memberId?: number): Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/resetpassword/${memberId}`, {
        method: 'PUT',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
