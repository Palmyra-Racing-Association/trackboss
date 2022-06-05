import { generateHeaders } from './utils';

import { GetGateCodeResponse } from '../../../src/typedefs/gateCode';

// eslint-disable-next-line import/prefer-default-export
export async function getGateCodeLatest(token: string): Promise<GetGateCodeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/gateCode/latest`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
