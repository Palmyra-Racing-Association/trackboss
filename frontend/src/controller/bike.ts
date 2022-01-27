import generateHeaders from './utils';

export async function createBike(token: string, bikeData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(bikeData),
    });
    return response.json();
}

export async function getBikeList(token: string, membershipID?: number) {
    if (membershipID) {
        const idString = membershipID.toString();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/list?membershipID=${idString}`, {
            method: 'GET',
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getBike(token: string, bikeID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateBike(token: string, bikeID: number, bikeData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(bikeData),
    });
    return response.json();
}

export async function deleteBike(token: string, bikeID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/bike/${bikeID}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
