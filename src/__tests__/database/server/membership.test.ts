import { PatchMembershipRequest } from 'src/typedefs/membership';
import { getMembership, getMembershipList, insertMembership, patchMembership } from '../../../database/membership';
import mockQuery from './mockQuery';

describe('insertMembership()', () => {
    it('Inserts a single membership', async () => {
        const request = { membershipAdminId: 42, modifiedBy: 0 };

        const result = await insertMembership(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { membershipAdminId: 1452, modifiedBy: 0 };

        await expect(insertMembership(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { membershipAdminId: -100, modifiedBy: 0 };

        await expect(insertMembership(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { membershipAdminId: -200, modifiedBy: 0 };

        await expect(insertMembership(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getMembershipList()', () => {
    it('Returns an unfiltered list of memberships', async () => {
        const results = await getMembershipList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of active memberships', async () => {
        const status = 'active';
        const expResultStatus = 'Active';

        const results = await getMembershipList(status);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.status).toBe(expResultStatus);
        });
    });

    it('Returns a filtered list of inactive memberships', async () => {
        const status = 'inactive';
        const expResultStatus = 'Disabled';

        const results = await getMembershipList(status);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.status).toBe(expResultStatus);
        });
    });

    it('Returns a filtered list of pending memberships', async () => {
        const status = 'pending';
        const expResultStatus = 'Pending';

        const results = await getMembershipList(status);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.status).toBe(expResultStatus);
        });
    });

    it('Returns an empty list of memberships without error', async () => {
        const status = 'notARealStatus';
        const results = await getMembershipList(status);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(0);
    });

    it('Throws for internal server error', async () => {
        const status = 'ise';
        await expect(getMembershipList(status)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getMembership()', () => {
    it('Selects a single membership', async () => {
        const membershipId = 18;
        const origValues = [
            membershipId,
            'membershipAdmin',
            'Active',
            0,
            0,
            2022,
            '1 Test St',
            'Rotester',
            'NT',
            '11111',
            '2022-02-08',
            42,
        ];

        const result = await getMembership(membershipId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.membershipId).toBe(membershipId);
        expect(result.membershipAdmin).toBe(origValues[1]);
        expect(result.status).toBe(origValues[2]);
        expect(result.curYearRenewed).toBe(origValues[3]);
        expect(result.renewalSent).toBe(origValues[4]);
        expect(result.yearJoined).toBe(origValues[5]);
        expect(result.address).toBe(origValues[6]);
        expect(result.city).toBe(origValues[7]);
        expect(result.state).toBe(origValues[8]);
        expect(result.zip).toBe(origValues[9]);
        expect(result.lastModifiedDate).toBe(origValues[10]);
        expect(result.lastModifiedBy).toBe(origValues[11]);
    });

    it('Throws for membership not found', async () => {
        const membershipId = 765;
        await expect(getMembership(membershipId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const membershipId = -100;
        await expect(getMembership(membershipId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchMembership()', () => {
    const testPatchWithObject = async (req: PatchMembershipRequest) => {
        const membershipId = 42;
        // no error means success
        await patchMembership(membershipId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a membership with membershipAdminId field', async () => {
        await testPatchWithObject({ membershipAdminId: 0, modifiedBy: 0 });
    });

    it('Patches a membership with status field', async () => {
        await testPatchWithObject({ status: 'active', modifiedBy: 0 });
    });

    it('Patches a membership with curYearRenewed field', async () => {
        await testPatchWithObject({ curYearRenewed: false, modifiedBy: 0 });
    });

    it('Patches a membership with renewalSent field', async () => {
        await testPatchWithObject({ renewalSent: true, modifiedBy: 0 });
    });

    it('Patches a membership with yearJoined field', async () => {
        await testPatchWithObject({ yearJoined: 0, modifiedBy: 0 });
    });

    it('Patches a membership with address field', async () => {
        await testPatchWithObject({ address: '', modifiedBy: 0 });
    });

    it('Patches a membership with city field', async () => {
        await testPatchWithObject({ city: '', modifiedBy: 0 });
    });

    it('Patches a membership with state field', async () => {
        await testPatchWithObject({ state: '', modifiedBy: 0 });
    });

    it('Patches a membership with zip field', async () => {
        await testPatchWithObject({ zip: '', modifiedBy: 0 });
    });

    it('Throws for user error', async () => {
        const membershipId = 1451;
        await expect(patchMembership(membershipId, { modifiedBy: 0 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for membership not found', async () => {
        const membershipId = 3000;
        await expect(patchMembership(membershipId, { modifiedBy: 0 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const membershipId = -100;
        await expect(patchMembership(membershipId, { modifiedBy: 0 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const membershipId = -200;
        await expect(patchMembership(membershipId, { modifiedBy: 0 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});
