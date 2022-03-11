import _ from 'lodash';
import { compareAsc } from 'date-fns';
import { GetJobListRequestFilters, Job, PatchJobRequest, PostNewJobRequest } from '../../../typedefs/job';
import * as job from '../../../database/job';

export const jobList: Job[] = [
    {
        jobId: 0,
        member: 'Doctor Tester',
        event: 'The MAIN Event!',
        start: '2022-07-12 9:00:00',
        end: '2022-07-14 22:00:00',
        title: 'Gate Watcher',
        verified: true,
        verifiedDate: '2022-02-07',
        pointsAwarded: 3,
        paid: false,
        lastModifiedDate: '2022-02-07',
        lastModifiedBy: 'Bob Tes',
    }, {
        jobId: 1,
        member: 'Testy Testerson',
        event: 'The second Event!',
        start: '2022-08-02 9:00:00',
        end: '2022-08-04 22:00:00',
        title: 'Waterer',
        verified: false,
        pointsAwarded: 0,
        paid: false,
        lastModifiedDate: '2022-02-07',
        lastModifiedBy: 'Bob Tes',
    }, {
        jobId: 2,
        event: 'The MAIN Event!',
        start: '2022-09-26 9:00:00',
        end: '2022-09-28 22:00:00',
        title: 'Gate Watcher',
        verified: false,
        pointsAwarded: 0,
        paid: false,
        lastModifiedDate: '2022-02-07',
        lastModifiedBy: 'Bob Tes',
    }, {
        jobId: 3,
        member: 'Doctor Tester',
        event: 'The MAIN Event!',
        start: '2033-12-28 07:00:00',
        end: '2033-12-28 17:00:00',
        title: 'Gate Watcher',
        verified: true,
        verifiedDate: '2022-02-07',
        pointsAwarded: 3,
        paid: false,
        lastModifiedDate: '2022-02-07',
        lastModifiedBy: 'Bob Tes',
    },
];

export const mockInsertJob = jest.spyOn(job, 'insertJob')
    .mockImplementationOnce((): Promise<number> => {
        throw new Error('internal server error');
    }).mockImplementationOnce((): Promise<number> => {
        throw new Error('user input error');
    }).mockImplementation((req: PostNewJobRequest): Promise<number> => {
        let type = '';
        switch (req.jobTypeId) {
            case 0:
                type = 'job1';
                break;
            default:
                type = 'a new job';
        }
        const newJob = {
            jobId: jobList.length,
            member: 'Testy Test',
            event: 'The MAIN Event!',
            start: req.jobStartDate as string,
            end: req.jobEndDate as string,
            title: type as string,
            pointsAwarded: 0,
            verified: false,
            paid: false,
            lastModifiedDate: '2022-02-02',
            lastModifiedBy: 'Bob',
        };
        return Promise.resolve(jobList.push(newJob) - 1);
    });

export const mockGetJob = jest.spyOn(job, 'getJob')
    .mockImplementation((id: number): Promise<Job> => {
        let returnJob: Job[] = [];
        if (id === 400) {
            throw new Error('internal server error');
        }
        returnJob = _.filter(jobList, (j: Job) => j.jobId === id);
        if (returnJob.length === 0) {
            throw new Error('not found');
        }
        return Promise.resolve(returnJob[0]);
    });

/// sdhfg

export const mockGetJobList =
    jest.spyOn(job, 'getJobList').mockImplementationOnce((): Promise<Job[]> => {
        throw new Error('internal server error');
    }).mockImplementation((filters: GetJobListRequestFilters): Promise<Job[]> => {
        let jobs: Job[] = jobList;
        const { startDate, endDate } = filters;
        if (typeof startDate !== 'undefined') {
            jobs = _.filter(jobs, (j: Job) => compareAsc(new Date(j.start), new Date(startDate)) >= 0);
        }
        if (typeof endDate !== 'undefined') {
            jobs = _.filter(jobs, (j: Job) => compareAsc(new Date(j.end), new Date(endDate)) <= 0);
        }
        return Promise.resolve(jobs);
    });

export const mockPatchJob = jest.spyOn(job, 'patchJob').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (jobId: number, req: PatchJobRequest): Promise<void> => {
    const filtered = _.filter(jobList, (j: Job) => j.jobId === jobId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    jobList[jobId] = {
        ...jobList[jobId],
        ...req,
    };
});

export const mockDeleteJob = jest.spyOn(job, 'deleteJob').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementation(async (jobId: number): Promise<void> => {
    const deleted = _.remove(jobList, (j: Job) => j.jobId === jobId);
    if (deleted.length === 0) {
        throw new Error('not found');
    }
});
