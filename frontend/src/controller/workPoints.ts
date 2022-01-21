import { errorHandler, generateHeaders } from "./utils";

export async function getByMember(token: String, memberId: Number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMember/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    if (response.status === 200) {
        return response.json();
    }
    return errorHandler(response);
}

export async function getByMembership(token: String, membershipId: Number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/byMembership/${membershipId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    if (response.status === 200) {
        return response.json();
    }
    return errorHandler(response);
}
