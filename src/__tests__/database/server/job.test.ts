import 'dotenv/config';
import { PatchJobRequest } from 'src/typedefs/job';
import { getJob, getJobList, insertJob, patchJob, deleteJob } from '../../../database/job';
import { mockQuery } from './mockQuery';

describe('insertJob()', () => {
    it('Inserts a single job', async () => {
        const request = { memberId: 42, jobTypeId: 1, modifiedBy: 2 };

        const result = await insertJob(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { memberId: 1452, jobTypeId: 1, modifiedBy: 1 };

        await expect(insertJob(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { memberId: -100, jobTypeId: 1, modifiedBy: 1 };

        await expect(insertJob(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { memberId: -200, jobTypeId: 1, modifiedBy: 1 };

        await expect(insertJob(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getJobList()', () => {
    it('Returns an unfiltered list of jobs', async () => {
        const results = await getJobList({});
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });
    it('Returns a filtered list of jobs by assignment status', async () => {
        const getListRequestFilters: any = {
            assignmentStatus: 1,
            verificationStatus: '1',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.member).toBeDefined();
        });
    });
    it('Returns a filtered list of jobs by unassigned status', async () => {
        const getListRequestFilters: any = {
            assignmentStatus: 0,
            verificationStatus: '0',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.member).toBeNull();
        });
    });
    it('Returns a filtered list of jobs by verification status', async () => {
        const getListRequestFilters: any = {
            verificationStatus: '2',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.verified).toBe(false);
        });
    });
    it('Returns a filtered list of jobs by member', async () => {
        // Member 50 is 'Doctor Tester' in the mock
        const expectedName = 'Doctor Tester';
        const getListRequestFilters: any = {
            memberId: '50',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.member).toBe(expectedName);
        });
    });
    it('Returns a filtered list of jobs by membership_id', async () => {
        // Membership 600 only has jobs done by 'Doctor Tester' in the mock
        const expectedName = 'Doctor Tester';
        const getListRequestFilters: any = {
            membershipId: '600',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.member).toBe(expectedName);
        });
    });
    it('Returns a filtered list of jobs by event_id', async () => {
        // Event 100 is 'The MAIN Event!' in the mock
        const expectedName = 'The MAIN Event!';
        const getListRequestFilters: any = {
            eventId: '100',
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.event).toBe(expectedName);
        });
    });
    it('Returns a filtered list of jobs by startDate', async () => {
        const date = '2021-01-01';
        const getListRequestFilters: any = {
            verificationStatus: '200',
            startDate: date,
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(Date.parse(result.start)).toBeGreaterThan(Date.parse(date));
        });
    });
    it('Returns a filtered list of jobs by endDate', async () => {
        const date = '2022-01-01';
        const getListRequestFilters: any = {
            verificationStatus: '201',
            endDate: date,
        };
        const results = await getJobList(getListRequestFilters);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(Date.parse(result.start)).toBeLessThanOrEqual(Date.parse(date));
        });
    });
    it('Throws for internal server error', async () => {
        const getListRequestFilters: any = {
            verificationStatus: '-100',
        };
        await expect(getJobList(getListRequestFilters)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getJob()', () => {
    it('Selects a single job', async () => {
        const jobId = 18;
        const origValues = [
            jobId,
            'Doctor Tester',
            'The MAIN Event!',
            '2021-12-28 08:00:00',
            '2021-12-28 18:00:00',
            'Gate Watcher',
            1,
            '2022-02-07',
            '3',
            0,
            null,
            '2022-02-07',
            'Bob Tes',
        ];

        const result = await getJob(jobId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.jobId).toBe(jobId);
        expect(result.member).toBe(origValues[1]);
        expect(result.event).toBe(origValues[2]);
        expect(result.start).toBe(origValues[3]);
        expect(result.end).toBe(origValues[4]);
        expect(result.title).toBe(origValues[5]);
        expect(result.verified).toBe(origValues[6]);
        expect(result.verifiedDate).toBe(origValues[7]);
        expect(result.pointsAwarded).toBe(origValues[8]);
        expect(result.paid).toBe(origValues[9]);
        expect(result.paidDate).toBe(origValues[10]);
        expect(result.lastModifiedDate).toBe(origValues[11]);
        expect(result.lastModifiedBy).toBe(origValues[12]);
    });

    it('Throws for member not found', async () => {
        const jobId = 765;
        await expect(getJob(jobId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const jobId = -100;
        await expect(getJob(jobId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchJob()', () => {
    const testPatchWithObject = async (req: PatchJobRequest) => {
        const jobId = 42;
        // no error means success
        await patchJob(jobId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a job with memberId field', async () => {
        await testPatchWithObject({ memberId: 2, modifiedBy: 0 });
    });

    it('Patches a job with eventId field', async () => {
        await testPatchWithObject({ eventId: 2, modifiedBy: 0 });
    });

    it('Patches a job with jobTypeId field', async () => {
        await testPatchWithObject({ jobTypeId: 2, modifiedBy: 0 });
    });

    it('Patches a job with jobStartDate field', async () => {
        await testPatchWithObject({ jobStartDate: '1999-09-09', modifiedBy: 0 });
    });

    it('Patches a job with jobEndDate field', async () => {
        await testPatchWithObject({ jobEndDate: '1999-09-09', modifiedBy: 0 });
    });

    it('Patches a job with points awarded field', async () => {
        await testPatchWithObject({ pointsAwarded: 2, modifiedBy: 0 });
    });

    it('Patches a job with verified field', async () => {
        await testPatchWithObject({ verified: true, modifiedBy: 0 });
    });

    it('Patches a job with paid field', async () => {
        await testPatchWithObject({ paid: true, modifiedBy: 0 });
    });

    it('Throws for user error', async () => {
        const jobId = 1451;
        await expect(patchJob(jobId, { modifiedBy: 0 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for job not found', async () => {
        const jobId = 3000;
        await expect(patchJob(jobId, { modifiedBy: 0 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const jobId = -100;
        await expect(patchJob(jobId, { modifiedBy: 0 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const memberId = -200;
        await expect(patchJob(memberId, { modifiedBy: 0 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('deleteJob()', () => {
    it('deletes a single job', async () => {
        const jobId = 50;
        await deleteJob(jobId);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const jobId = 5000;
        await expect(deleteJob(jobId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const jobId = -100;
        await expect(deleteJob(jobId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});
