import { PatchJobRequest } from 'src/typedefs/job';
import { getJob, getJobList, insertJob, patchJob, deleteJob } from '../../../database/job';

import { getMember, getMemberList, insertMember, patchMember } from '../../../database/member';
import mockQuery from './mockQuery';

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

// describe('getMemberList()', () => {
//     it('Returns an unfiltered list of members', async () => {
//         const results = await getMemberList();
//         expect(mockQuery).toHaveBeenCalled();
//         expect(results.length).toBeGreaterThan(1);
//     });

//     it('Returns a filtered list of admins', async () => {
//         const type = 'admin';
//         const expResultType = 'Admin';

//         const results = await getMemberList(type);
//         expect(mockQuery).toHaveBeenCalled();
//         results.forEach((result) => {
//             expect(result.memberType).toBe(expResultType);
//         });
//     });

//     it('Returns a filtered list of membership admins', async () => {
//         const type = 'membershipAdmin';
//         const expResultType = 'Membership Admin';

//         const results = await getMemberList(type);
//         expect(mockQuery).toHaveBeenCalled();
//         results.forEach((result) => {
//             expect(result.memberType).toBe(expResultType);
//         });
//     });

//     it('Returns a filtered list of members', async () => {
//         const type = 'member';
//         const expResultType = 'Member';

//         const results = await getMemberList(type);
//         expect(mockQuery).toHaveBeenCalled();
//         results.forEach((result) => {
//             expect(result.memberType).toBe(expResultType);
//         });
//     });

//     it('Returns a filtered list of paid laborers', async () => {
//         const type = 'paidLaborer';
//         const expResultType = 'Paid Laborer';

//         const results = await getMemberList(type);
//         expect(mockQuery).toHaveBeenCalled();
//         results.forEach((result) => {
//             expect(result.memberType).toBe(expResultType);
//         });
//     });

//     it('Returns an empty list of members without error', async () => {
//         const type = 'notARealType';
//         const results = await getMemberList(type);
//         expect(mockQuery).toHaveBeenCalled();
//         expect(results.length).toBe(0);
//     });

//     it('Throws for internal server error', async () => {
//         const type = 'ise';
//         await expect(getMemberList(type)).rejects.toThrow('internal server error');
//         expect(mockQuery).toHaveBeenCalled();
//     });
// });

describe('getJob()', () => {
    it('Selects a single job', async () => {
        const jobId = 18;
        const origValues = [
            jobId,
            'Doctor Tester',
            'The MAIN Event!',
            '2021-12-28',
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
        expect(result.jobDate).toBe(origValues[3]);
        expect(result.jobType).toBe(origValues[4]);
        expect(result.verified).toBe(origValues[5]);
        expect(result.verifiedDate).toBe(origValues[6]);
        expect(result.pointsAwarded).toBe(origValues[7]);
        expect(result.paid).toBe(origValues[8]);
        expect(result.paidDate).toBe(origValues[9]);
        expect(result.lastModifiedDate).toBe(origValues[10]);
        expect(result.lastModifiedBy).toBe(origValues[11]);
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

    it('Patches a job with jobDate field', async () => {
        await testPatchWithObject({ jobDate: '1999-09-09', modifiedBy: 0 });
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
