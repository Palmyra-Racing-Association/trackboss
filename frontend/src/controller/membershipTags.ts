import { generateHeaders } from './utils';

import { MembershipTag } from '../../../src/typedefs/membershipTag';

export async function getMembershipTags(
    token: string,
    id: number,
): Promise<MembershipTag[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/tags/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function addMembershipTags(
    token: string,
    membershipId: number,
    tags: string[],
) : Promise<MembershipTag[]> {
    const tagsBody = {
        membershipId,
        tags,
    };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/tags`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(tagsBody),
    });
    return response.json();
}

export async function deleteMembershipTags(
    token: string,
    membershipId: number,
    tags: string[],
) : Promise<MembershipTag[]> {
    const tagsBody = {
        membershipId,
        tags,
    };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/tags`, {
        method: 'DELETE',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(tagsBody),
    });
    return response.json();
}

export async function getUniqueTags(token: string) : Promise<MembershipTag[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipTags/unique`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
