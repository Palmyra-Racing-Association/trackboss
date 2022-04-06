import { generateHeaders } from './utils';
import {
    DeleteJobResponse,
    GetJobListResponse,
    GetJobResponse,
    PatchJobRequest,
    PatchJobResponse,
    PostCloneJobResponse,
    PostNewJobRequest,
    PostNewJobResponse,
} from '../../../src/typedefs/job';

export async function createJob(token: string, jobData: PostNewJobRequest): Promise<PostNewJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/new`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(jobData),
    });
    return response.json();
}

export async function getJobList(token: string, queryType?: string, filterType?: string): Promise<GetJobListResponse> {
    if (queryType && filterType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/list?${queryType}=${filterType}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getCalendarJobs(token: string) {
    const calendarJobs = await getJobList(token);
    if (Array.isArray(calendarJobs)) {
        calendarJobs.forEach((job) => {
            job.start = new Date(job.start);
            job.end = new Date(job.end);
        });
        return calendarJobs;
    }

    // else
    return undefined;
}

export async function getJob(token: string, jobID: number): Promise<GetJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/${jobID}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateJob(token: string, jobID: number, jobData: PatchJobRequest): Promise<PatchJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/${jobID}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
        body: JSON.stringify(jobData),
    });
    return response.json();
}

export async function cloneJob(token: string, jobID: number): Promise<PostCloneJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/${jobID}`, {
        method: 'POST',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function deleteJob(token: string, jobID: number): Promise<DeleteJobResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/${jobID}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    const res: DeleteJobResponse = await response.json();
    return res;
}

export async function setVerifiedState(token: string, jobId: number, state: boolean) : Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/verify/${jobId}/${state}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

interface Worker {
    name: string,
    job: string,
    verified: boolean
}

export async function getSignupList(token: string, eventId: number): Promise<Worker[]> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/list?eventID=${eventId}`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
