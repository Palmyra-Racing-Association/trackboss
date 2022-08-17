import { generateHeaders } from './utils';
import { RidingAreaStatus } from '../../../src/typedefs/ridingAreaStatus';

export default async function getRidingAreaStatuses(token: string) : Promise<RidingAreaStatus[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ridingAreaStatus`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
