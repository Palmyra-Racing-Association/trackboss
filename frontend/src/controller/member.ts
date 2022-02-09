import generateHeaders from './utils';
import {
    GetMemberListResponse,
    GetMemberResponse,
    PatchMemberRequest,
    PatchMemberResponse,
    PostNewMemberRequest,
    PostNewMemberResponse,
} from '../../../src/typedefs/member';

export async function createMember(token: string, memberData: PostNewMemberRequest): Promise<PostNewMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMember(token: string, memberId: number): Promise<GetMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getMemberList(token: string, listType?: string): Promise<GetMemberListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list?status=${listType}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list`, {
        method: 'GET',
        mode: 'no-cors',
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
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

// this is a mocked api call
// TODO: change this when the api is done

export async function getName() {
    const response = {
        name: 'Martin',
    };

    return response;
}
