import { generateHeaders } from './utils';
import { MemberType } from '../../../src/typedefs/memberType';

// eslint-disable-next-line import/prefer-default-export
export async function getMembershipTypeCounts(token: string): Promise<MemberType[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/memberType/membershipCounts`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
