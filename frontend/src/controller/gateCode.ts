import { generateHeaders } from './utils';

import { GetGateCodeResponse } from '../../../src/typedefs/gateCode';

export async function getGateCodeLatest(token: string): Promise<GetGateCodeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/gateCode/latest`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function createGateCode(token: string, gateCode: string): Promise<GetGateCodeResponse> {
    const gateCodeRequest = {
        year: (new Date()).getFullYear(),
        gateCode,
    };
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/gateCode/latest`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(gateCodeRequest),
    });
    return response.json();
}
