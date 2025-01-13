import { generateHeaders } from './utils';

import { MembershipApplication } from '../../../src/typedefs/membershipApplication';

function buildNotesBody(internalNotes: string, applicantNotes: string) {
    return JSON.stringify({
        internalNotes,
        applicantNotes,
    });
}

// eslint-disable-next-line import/prefer-default-export
export async function getMembershipApplications(token: string): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
export async function getMembershipApplication(
    token: string,
    id: number,
): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function applicationExists(
    email: string,
) : Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/exists/${email}`, {
        method: 'GET',
        mode: 'cors',
    });
    return response.json();
}

export async function acceptMembershipApplication(
    token: string,
    id: number,
    internalNotes: string,
    applicantNotes: string,
    isGuest?: boolean,
): Promise<MembershipApplication[]> {
    let acceptUrl = `${process.env.REACT_APP_API_URL}/api/membershipApplication/accept/${id}`;
    if (isGuest) {
        acceptUrl = `${acceptUrl}?guest=${isGuest}`;
    }
    const response = await fetch(
        acceptUrl,
        {
            method: 'POST',
            mode: 'cors',
            headers: generateHeaders(token),
            body: buildNotesBody(internalNotes, applicantNotes),
        },
    );
    return response.json();
}
export async function rejectMembershipApplication(
    token: string,
    id: number,
    internalNotes: string,
    applicantNotes: string,
): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/reject/${id}`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: buildNotesBody(internalNotes, applicantNotes),
    });
    return response.json();
}
export async function reviewMembershipApplication(
    token: string,
    id: number,
    internalNotes: string,
    applicantNotes: string,
): Promise<MembershipApplication[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/review/${id}`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: buildNotesBody(internalNotes, applicantNotes),
    });
    return response.json();
}

export async function getMembershipApplicationListExcel(token: string): Promise<Blob> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membershipApplication/list/excel`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.blob();
}
