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

// TODO: this is a mocked response, redo once API is complete
export async function getJobAttendees() {
    return [
        {
            name: 'Bob Dylan',
        },
        {
            name: 'Billy Joel',
        },
        {
            name: 'Jimi Hendrix',
        },
        {
            name: 'John Lennon',
        },
    ];
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

interface Worker {
    name: string,
    job: string,
    verified: boolean
}

// mocked api call
// TODO: replace with actual call to api/job/list with date range when api is complete
export function getFormattedSignUpList(): Worker[] {
    const response = [
        {
            jobId: 1,
            member: 'Alan Delimon',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: true,
            verifiedDate: '2022-02-24',
        },
        {
            jobId: 2,
            member: 'Alfie Hurst',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 3,
            member: 'Zion Lake',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 4,
            member: 'Rianna Ellwood',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 5,
            member: 'Raisa Rollins',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 6,
            member: 'Eli Akhtar',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 7,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 8,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 9,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 10,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 11,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 12,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 12,
            member: 'Alan Delimon',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: true,
            verifiedDate: '2022-02-24',
        },
        {
            jobId: 14,
            member: 'Alfie Hurst',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 15,
            member: 'Zion Lake',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Rock Picking',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 16,
            member: 'Rianna Ellwood',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 17,
            member: 'Raisa Rollins',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 18,
            member: 'Eli Akhtar',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Track Watering',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 19,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 20,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 21,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 22,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 23,
            member: 'Stella Craig',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
        {
            jobId: 24,
            member: 'Hudson Naylor',
            event: 'Race',
            jobDate: '2022-02-11',
            jobType: 'Lawn Mowing',
            verified: false,
            verifiedDate: '',
        },
    ];

    const formattedResponse = response.map((worker) => ({
        name: worker.member,
        job: worker.jobType,
        verified: worker.verified,
    }));

    return formattedResponse;
}
