import generateHeaders from './utils';

export async function getYearlyThreshold(token: string) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/yearlyWorkPointThreshold`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBills(token: string) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response;
}

export async function getBillsForMembership(token: string, membershipID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function generateBills(token: string) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function payBill(token: string, membershipID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response;
}
