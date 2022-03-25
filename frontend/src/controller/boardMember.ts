import { GetBoardMemberTypeListResponse } from '../../../src/typedefs/boardMemberType';
import {
    GetBoardMemberListResponse,
    PatchBoardMemberRequest,
    PatchBoardMemberResponse,
    PostNewBoardMemberRequest,
    PostNewBoardMemberResponse,
} from '../../../src/typedefs/boardMember';
import { generateHeaders } from './utils';

export async function getAllBoardMembersForCurrentYear(token: string): Promise<GetBoardMemberListResponse> {
    const currentYear = new Date().getFullYear();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boardMember/list?year=${currentYear}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBoardRoles(token: string): Promise<GetBoardMemberTypeListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boardMemberType/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateBoardMember(
    token: string,
    boardMemberId: number,
    req: PatchBoardMemberRequest,
): Promise<PatchBoardMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boardMember/${boardMemberId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(req),
    });
    return response.json();
}

export async function createBoardMember(
    token: string,
    req: PostNewBoardMemberRequest,
): Promise<PostNewBoardMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/boardMember/new`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(req),
    });
    return response.json();
}
