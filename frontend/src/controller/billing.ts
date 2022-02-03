import generateHeaders from './utils';
import {
    GetBillListResponse,
    GetMembershipBillListResponse,
    GetWorkPointThresholdResponse,
    PostCalculateBillsResponse,
    PostPayBillResponse,
} from '../../../src/typedefs/bill';

export async function getYearlyThreshold(token: string): Promise<GetWorkPointThresholdResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/yearlyWorkPointThreshold`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBills(token: string): Promise<GetBillListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBillsForMembership(
    token: string,
    membershipID: number,
): Promise<GetMembershipBillListResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function generateBills(token: string): Promise<PostCalculateBillsResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function payBill(token: string, membershipID: number): Promise<PostPayBillResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/billing/${membershipID}`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
