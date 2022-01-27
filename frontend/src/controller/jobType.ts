import generateHeaders from './utils';

export async function createJobType(token: string, memberData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getJobTypeList(token: string) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getJobType(token: string, jobTypeID: number) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/${jobTypeID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateJobType(token: string, jobTypeID: number, jobTypeData: object) {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/jobType/${jobTypeID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(jobTypeData),
    });
    return response.json();
}
