import { generateHeaders } from './utils';
import { RidingAreaStatus } from '../../../src/typedefs/ridingAreaStatus';

export async function getRidingAreaStatuses(token: string) : Promise<RidingAreaStatus[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ridingAreaStatus`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateRidingAreaStatus(
    token: string,
    areaId: number,
    ridingAreaData: RidingAreaStatus,
): Promise<RidingAreaStatus> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/ridingAreaStatus/${areaId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(ridingAreaData),
    });
    return response.json();
}
