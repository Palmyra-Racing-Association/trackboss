import _ from 'lodash';
import * as eventJob from '../../../database/eventJob';
import { EventJob, PatchEventJobRequest, PostNewEventJobRequest } from '../../../typedefs/eventJob';

export const eventJobList: EventJob[] = [
    {
        eventJobId: 0,
        eventType: 'event type',
        jobType: 'job type',
        count: 0,
    },
    {
        eventJobId: 1,
        eventType: 'event type',
        jobType: 'job type',
        count: 0,
    },
];

export const mockInsertEventJob = jest.spyOn(eventJob, 'insertEventJob').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((req: PostNewEventJobRequest): Promise<number> => {
    const newEventJob = {
        eventJobId: eventJobList.length,
        eventType: 'event type',
        jobType: 'job type',
        count: req.count,
    };
    return Promise.resolve(eventJobList.push(newEventJob) - 1);
});

export const mockGetEventJob = jest.spyOn(eventJob, 'getEventJob').mockImplementation((eventJobId: number) => {
    let returnEventJob: EventJob[] = [];
    if (eventJobId === 400) {
        throw new Error('internal server error');
    }
    returnEventJob = _.filter(eventJobList, (mem: EventJob) => mem.eventJobId === eventJobId);

    if (returnEventJob.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnEventJob[0]);
});

export const mockPatchEventJob = jest.spyOn(eventJob, 'patchEventJob').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (eventJobId: number, req: PatchEventJobRequest): Promise<void> => {
    const filtered = _.filter(eventJobList, (b: EventJob) => b.eventJobId === eventJobId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    eventJobList[eventJobId] = {
        ...eventJobList[eventJobId],
        ...req,
    };
});

export const mockDeleteEventJob = jest.spyOn(eventJob, 'deleteEventJob').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementation(async (eventJobId: number): Promise<void> => {
    const deleted = _.remove(eventJobList, (b: EventJob) => b.eventJobId === eventJobId);
    if (deleted.length === 0) {
        throw new Error('not found');
    }
});
