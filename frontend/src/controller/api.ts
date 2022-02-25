import { generateHeaders } from './utils';
import { Member } from '../../../src/typedefs/member';

export default async function me(token: string): Promise<Member> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/me`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
