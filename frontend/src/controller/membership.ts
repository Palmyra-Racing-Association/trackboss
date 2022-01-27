import generateHeaders from './utils';

export async function createMembership(token: string, memberData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMembershipList(token: string, listType: string | undefined) {
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

export async function getMembership(token: string, membershipID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/${membershipID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateMembership(token: string, membershipID: number, memberData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/membership/${membershipID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function registerMembership(registrationData: object) {
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
