import { generateHeaders } from './utils';
import {
    DeleteJobResponse,
    GetJobListResponse,
    GetJobResponse,
    Job,
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
            if (job.end) {
                job.end = new Date(job.end);
            }
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

export async function setPaidState(token: string, jobId: number) : Promise<any> {
    const paidJob : any = await getJob(token, jobId);
    const isPaidLaborer = (!paidJob.memberId && paidJob.member);
    if (isPaidLaborer) {
        paidJob.paidLabor = paidJob.member;
    }
    paidJob.paid = !paidJob.paid;
    const modifiedJob : any = await updateJob(token, jobId, paidJob);
    return modifiedJob;
}

/**
 * Signup a user for a job.
 * @param token user token
 * @param jobId job to sign up for.
 * @param memberId member to signup for the job.
 * @returns job signed up for.
 */
export async function signupForJob(token:string, jobId: number, memberId: number) : Promise<any> {
    const signupJob : any = await getJob(token, jobId);
    signupJob.memberId = memberId;
    const modifiedJob : any = await updateJob(token, jobId, signupJob);
    return modifiedJob;
}

export async function signupForJobFreeForm(token: string, jobId: number, name: string) : Promise<any> {
    const signupJob : any = await getJob(token, jobId);
    // when we add paid labor to a job the assumption is that it is paid. Admins can undo this, but this
    // assumption saves them work.
    signupJob.paidLabor = name;
    signupJob.paid = true;
    const modifiedJob : any = await updateJob(token, jobId, signupJob);
    return modifiedJob;
}

export async function signupForOpenEventJob(token: string, eventId: number, memberId: number) : Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/event/${eventId}/${memberId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function removeSignup(token:string, jobId: number) : Promise<any> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/remove/signup/${jobId}`, {
        method: 'PATCH',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function modifyJobPoints(token: string, jobId:number, points: number) : Promise<any> {
    const signupJob : GetJobResponse = await getJob(token, jobId) as Job;
    signupJob.pointsAwarded = points;
    const updatedJob = await updateJob(token, jobId, signupJob);
    return updatedJob;
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

export async function getSignupListExcel(token: string, eventId: number, shouldGetJobs: boolean): Promise<Blob> {
    let response;
    if (shouldGetJobs) {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/job/list/excel?eventID=${eventId}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
    } else {
        response = await fetch(`${process.env.REACT_APP_API_URL}/api/workPoints/list/excel`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
    }
    return response.blob();
}
