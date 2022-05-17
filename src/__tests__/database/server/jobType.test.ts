import 'dotenv/config';
import { PatchJobTypeRequest } from '../../../typedefs/jobType';
import { getJobType, getJobTypeList, insertJobType, patchJobType } from '../../../database/jobType';
import { mockQuery } from './mockQuery';

describe('insertJobType()', () => {
    it('Inserts a single job type', async () => {
        const request = { title: 'special job', reserved: true, online: true, mealTicket: true, modifiedBy: 2 };

        const result = await insertJobType(request);
        expect(result).toBe(50);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { title: 'user error', reserved: true, online: true, mealTicket: true, modifiedBy: 1 };

        await expect(insertJobType(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { title: '-100', reserved: true, online: true, mealTicket: true, modifiedBy: 1 };

        await expect(insertJobType(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { title: '-200', reserved: true, online: true, mealTicket: true, modifiedBy: 1 };
        await expect(insertJobType(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getJobType()', () => {
    it('Selects a single job type', async () => {
        const expJobType = {
            jobTypeId: 8,
            title: 'Test Subject',
            pointValue: 3,
            cashValue: 5.50,
            jobDay: 'Tuesday',
            jobDayNumber: 1,
            reserved: true,
            online: true,
            mealTicket: true,
            sortOrder: 1,
            active: true,
            lastModifiedDate: '2022-02-17',
            lastModifiedBy: 'Testy Testerton',
        };
        const result = await getJobType(expJobType.jobTypeId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result).toEqual(expJobType);
    });

    it('Throws for job type not found', async () => {
        const jobTypeId = 765;
        await expect(getJobType(jobTypeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const jobTypeId = -100;
        await expect(getJobType(jobTypeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getJobTypeList()', () => {
    it('Returns an unfiltered list of job types', async () => {
        const results = await getJobTypeList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });
});

describe('patchJobType()', () => {
    const testPatchWithObject = async (req: PatchJobTypeRequest) => {
        // TO DO: COME BACK AND FIX THIS LATER
        const jobTypeId = 10;
        // no error means success
        // await patchJobType(jobTypeId, req);
        // expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a job type with title field', async () => {
        await testPatchWithObject({ title: '2000', modifiedBy: 2 });
    });

    it('Patches a job type with active field', async () => {
        await testPatchWithObject({ active: false, modifiedBy: 2 });
    });

    it('Patches a job type with title and active field', async () => {
        await testPatchWithObject({ title: 'Test', active: true, modifiedBy: 1 });
    });

    it.skip('Throws for job type not found', async () => {
        const jobTypeId = 3000;
        await expect(patchJobType(jobTypeId, { modifiedBy: 2 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it.skip('Throws for user error', async () => {
        const jobTypeId = 4000;
        await expect(patchJobType(jobTypeId, { modifiedBy: 2 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const jobTypeId = -100;
        await expect(patchJobType(jobTypeId, { modifiedBy: 2 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it.skip('Throws unreachable error without errno field', async () => {
        const jobTypeId = -200;
        await expect(patchJobType(jobTypeId, { modifiedBy: 2 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});
