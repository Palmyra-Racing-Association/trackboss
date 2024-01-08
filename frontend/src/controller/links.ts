import { GetLinkResponse } from '../../../src/typedefs/link';
import { generateHeaders } from './utils';

// eslint-disable-next-line import/prefer-default-export
export async function getLinks(token: string): Promise<GetLinkResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/link/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
