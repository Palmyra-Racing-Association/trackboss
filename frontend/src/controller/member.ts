import generateHeaders from "./utils";


export async function createMember(token: string, memberData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMember(token: string, memberId: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getMemberList(token: string, listType?: string) {
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

export async function updateMember(token: string, memberID: number, memberData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}