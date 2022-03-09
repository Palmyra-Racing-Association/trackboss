import _ from 'lodash';
import * as jobType from '../../../database/jobType';
import { JobType, PatchJobTypeRequest, PostNewJobTypeRequest } from '../../../typedefs/jobType';

export const jobTypeList: JobType[] = [
    {
        jobTypeId: 0,
        title: 'job type 0',
        pointValue: 0,
        cashValue: 0,
        jobDayNumber: 0,
        reserved: true,
        online: true,
        mealTicket: true,
        sortOrder: 0,
        active: true,
        lastModifiedDate: '2022-03-08',
        lastModifiedBy: 'He Who Writes the Tests',
    },
    {
        jobTypeId: 1,
        title: 'job type 1',
        pointValue: 0,
        cashValue: 0,
        jobDayNumber: 0,
        reserved: true,
        online: true,
        mealTicket: true,
        sortOrder: 0,
        active: true,
        lastModifiedDate: '2022-03-08',
        lastModifiedBy: 'He Who Writes the Tests',
    },
    {
        jobTypeId: 2,
        title: 'job type 2',
        pointValue: 0,
        cashValue: 0,
        jobDayNumber: 0,
        reserved: true,
        online: true,
        mealTicket: true,
        sortOrder: 0,
        active: true,
        lastModifiedDate: '2022-03-08',
        lastModifiedBy: 'He Who Writes the Tests',
    },
    {
        jobTypeId: 3,
        title: 'job type 3',
        pointValue: 0,
        cashValue: 0,
        jobDayNumber: 0,
        reserved: true,
        online: true,
        mealTicket: true,
        sortOrder: 0,
        active: true,
        lastModifiedDate: '2022-03-08',
        lastModifiedBy: 'He Who Writes the Tests',
    },
];

export const mockInsertJobType = jest.spyOn(jobType, 'insertJobType').mockImplementationOnce((): Promise<number> => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((req: PostNewJobTypeRequest): Promise<number> => {
    const newJobType = {
        jobTypeId: 4,
        title: req.title,
        pointValue: req.pointValue || 0,
        cashValue: req.cashValue || 0,
        jobDayNumber: req.jobDayNumber || 0,
        reserved: req.reserved,
        online: req.online,
        mealTicket: req.mealTicket,
        sortOrder: req.sortOrder || 0,
        active: true,
        lastModifiedDate: '2022-03-08',
        lastModifiedBy: 'He Who Writes the Tests',
    };
    return Promise.resolve(jobTypeList.push(newJobType) - 1);
});

export const mockGetJobTypeList = jest.spyOn(jobType, 'getJobTypeList').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((): Promise<JobType[]> => Promise.resolve(jobTypeList));

export const mockGetJobType = jest.spyOn(jobType, 'getJobType').mockImplementation((jobTypeId: number) => {
    let returnType: JobType[] = [];
    if (jobTypeId === 400) {
        throw new Error('internal server error');
    }
    returnType = _.filter(jobTypeList, (jt: JobType) => jt.jobTypeId === jobTypeId);

    if (returnType.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnType[0]);
});

export const mockPatchJobType = jest.spyOn(jobType, 'patchJobType').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (jobTypeId: number, req: PatchJobTypeRequest): Promise<void> => {
    const filtered = _.filter(jobTypeList, (m: JobType) => m.jobTypeId === jobTypeId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    jobTypeList[jobTypeId] = {
        ...jobTypeList[jobTypeId],
        ...req,
    };
});
