import {
    DeletePaidLaborResponse,
    GetPaidLaborResponse,
    PaidLabor,
} from '../../../src/typedefs/paidLabor';
import { generateHeaders } from './utils';

export async function getPaidLaborList(token: string): Promise<GetPaidLaborResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paidLabor/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function deletePaidLabor(token: string, id:number): Promise<DeletePaidLaborResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paidLabor/${id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updatePaidLabor(token: string, laborer: PaidLabor) : Promise<GetPaidLaborResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paidLabor/${laborer.paidLaborId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(laborer),
    });
    return response.json();
}

export async function createPaidLabor(token: string, laborer: PaidLabor) : Promise<PaidLabor> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/paidLabor`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(laborer),
    });
    return response.json();
}
