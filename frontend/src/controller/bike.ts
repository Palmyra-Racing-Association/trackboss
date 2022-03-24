import { generateHeaders } from './utils';
import {
    DeleteBikeResponse,
    GetBikeListResponse,
    GetBikeResponse,
    PatchBikeRequest,
    PatchBikeResponse,
    PostNewBikeRequest,
    PostNewBikeResponse,
} from '../../../src/typedefs/bike';

export async function createBike(token: string, bikeData: PostNewBikeRequest): Promise<PostNewBikeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(bikeData),
    });
    return response.json();
}

export async function getBikeList(token: string, membershipID?: number): Promise<GetBikeListResponse> {
    if (membershipID) {
        const idString = membershipID.toString();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/list?membershipID=${idString}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBike(token: string, bikeID: number): Promise<GetBikeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateBike(
    token: string,
    bikeID: number,
    bikeData: PatchBikeRequest,
): Promise<PatchBikeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(bikeData),
    });
    return response.json();
}

export async function deleteBike(token: string, bikeID: number): Promise<DeleteBikeResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
