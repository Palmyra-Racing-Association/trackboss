import 'dotenv/config';
import _ from 'lodash';

import { PatchEventJobRequest } from 'src/typedefs/eventJob';
import { deleteEventJob, getEventJob, insertEventJob, patchEventJob } from '../../../database/eventJob';
import { mockQuery } from './mockQuery';

describe('insertEventJob()', () => {
    it('Inserts a single event-job', async () => {
        const request = { eventTypeId: 1, jobTypeId: 1, count: 3 };

        const result = await insertEventJob(request);
        expect(result).toBe(50);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { eventTypeId: 1452, jobTypeId: 1, count: 3 };

        await expect(insertEventJob(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { eventTypeId: -100, jobTypeId: 1, count: 3 };

        await expect(insertEventJob(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { eventTypeId: -200, jobTypeId: 1, count: 3 };
        await expect(insertEventJob(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getEventJob()', () => {
    it('Selects a single event-job', async () => {
        const eventJobId = 8;
        const expEventJob = {
            event_job_id: eventJobId,
            event_type: 'Testing Day',
            job_type: 'Test Subject',
            count: 42,
        };
        const result = await getEventJob(eventJobId);
        expect(mockQuery).toHaveBeenCalled();
        expect(_.isEqual(result, expEventJob));
    });

    it('Throws for event-job not found', async () => {
        const eventJobId = 765;
        await expect(getEventJob(eventJobId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventJobId = -100;
        await expect(getEventJob(eventJobId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchEventJob()', () => {
    const testPatchWithObject = async (req: PatchEventJobRequest) => {
        const eventJobId = 10;
        // no error means success
        await patchEventJob(eventJobId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches an event-job with eventTypeId field', async () => {
        await testPatchWithObject({ eventTypeId: 2000 });
    });

    it('Patches an event-job with jobTypeId field', async () => {
        await testPatchWithObject({ jobTypeId: 2 });
    });

    it('Patches an event-job with count field', async () => {
        await testPatchWithObject({ count: 200 });
    });

    it('Throws for event-job not found', async () => {
        const eventJobId = 3000;
        await expect(patchEventJob(eventJobId, { jobTypeId: 2 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const eventJobId = 4000;
        await expect(patchEventJob(eventJobId, { jobTypeId: 2 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error ( empty body )', async () => {
        const eventJobId = 4000;
        await expect(patchEventJob(eventJobId, { })).rejects.toThrow('user input error');
    });

    it('Throws for internal server error', async () => {
        const eventJobId = -100;
        await expect(patchEventJob(eventJobId, { jobTypeId: 2 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const eventJobId = -200;
        await expect(patchEventJob(eventJobId, { jobTypeId: 2 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('deleteEventJob()', () => {
    it('Deletes an event-job', async () => {
        const eventJobId = 50;
        await deleteEventJob(eventJobId);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for event-job not found', async () => {
        const eventJobId = 5000;
        await expect(deleteEventJob(eventJobId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const eventJobId = -100;
        await expect(deleteEventJob(eventJobId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
