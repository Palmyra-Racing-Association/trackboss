import { PatchMemberRequest } from 'src/typedefs/member';
import { getMember, getMemberList, insertMember, patchMember } from '../../../database/member';
import { mockQuery } from './mockQuery';

describe('insertMember()', () => {
    it('Inserts a single member', async () => {
        const request = { membershipId: 42, memberTypeId: 1, modifiedBy: 1 };

        const result = await insertMember(request);
        expect(result).toBe(321);
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const request = { membershipId: 1452, memberTypeId: 1, modifiedBy: 1 };

        await expect(insertMember(request)).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const request = { membershipId: -100, memberTypeId: 1, modifiedBy: 1 };

        await expect(insertMember(request)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const request = { membershipId: -200, memberTypeId: 1, modifiedBy: 1 };

        await expect(insertMember(request)).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getMemberList()', () => {
    it('Returns an unfiltered list of members', async () => {
        const results = await getMemberList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });

    it('Returns a filtered list of admins', async () => {
        const type = 'admin';
        const expResultType = 'Admin';

        const results = await getMemberList(type);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.memberType).toBe(expResultType);
        });
    });

    it('Returns a filtered list of membership admins', async () => {
        const type = 'membershipAdmin';
        const expResultType = 'Membership Admin';

        const results = await getMemberList(type);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.memberType).toBe(expResultType);
        });
    });

    it('Returns a filtered list of members', async () => {
        const type = 'member';
        const expResultType = 'Member';

        const results = await getMemberList(type);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.memberType).toBe(expResultType);
        });
    });

    it('Returns a filtered list of paid laborers', async () => {
        const type = 'paidLaborer';
        const expResultType = 'Paid Laborer';

        const results = await getMemberList(type);
        expect(mockQuery).toHaveBeenCalled();
        results.forEach((result) => {
            expect(result.memberType).toBe(expResultType);
        });
    });

    it('Returns an empty list of members without error', async () => {
        const type = 'notARealType';
        const results = await getMemberList(type);
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBe(0);
    });

    it('Throws for internal server error', async () => {
        const type = 'ise';
        await expect(getMemberList(type)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getMember()', () => {
    it('Selects a single member by id', async () => {
        const memberId = '18';
        const origValues = [
            parseInt(memberId, 10),
            'membershipAdmin',
            'thisIsAUuid',
            1,
            'Member',
            'Test',
            'Testerson',
            '123-456-7890',
            'Ephemeral Testing Entity',
            'tester@testing.ts',
            '2022-02-07',
            '2022-02-07',
            '1 Test St',
            'Rotester',
            'NT',
            '11111',
            '2022-02-07',
            42,
        ];

        const result = await getMember(memberId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.memberId).toBe(parseInt(memberId, 10));
        expect(result.membershipAdmin).toBe(origValues[1]);
        expect(result.uuid).toBe(origValues[2]);
        expect(result.active).toBe(origValues[3]);
        expect(result.memberType).toBe(origValues[4]);
        expect(result.firstName).toBe(origValues[5]);
        expect(result.lastName).toBe(origValues[6]);
        expect(result.phoneNumber).toBe(origValues[7]);
        expect(result.occupation).toBe(origValues[8]);
        expect(result.email).toBe(origValues[9]);
        expect(result.birthdate).toBe(origValues[10]);
        expect(result.dateJoined).toBe(origValues[11]);
        expect(result.address).toBe(origValues[12]);
        expect(result.city).toBe(origValues[13]);
        expect(result.state).toBe(origValues[14]);
        expect(result.zip).toBe(origValues[15]);
        expect(result.lastModifiedDate).toBe(origValues[16]);
        expect(result.lastModifiedBy).toBe(origValues[17]);
    });

    it('Selects a single member by uuid', async () => {
        const memberId = 'thisIsAUuid';
        const origValues = [
            18,
            'membershipAdmin',
            parseInt(memberId, 10),
            1,
            'Member',
            'Test',
            'Testerson',
            '123-456-7890',
            'Ephemeral Testing Entity',
            'tester@testing.ts',
            '2022-02-07',
            '2022-02-07',
            '1 Test St',
            'Rotester',
            'NT',
            '11111',
            '2022-02-07',
            42,
        ];

        const result = await getMember(memberId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result.memberId).toBe(origValues[0]);
        expect(result.membershipAdmin).toBe(origValues[1]);
        expect(result.uuid).toBe(memberId);
        expect(result.active).toBe(origValues[3]);
        expect(result.memberType).toBe(origValues[4]);
        expect(result.firstName).toBe(origValues[5]);
        expect(result.lastName).toBe(origValues[6]);
        expect(result.phoneNumber).toBe(origValues[7]);
        expect(result.occupation).toBe(origValues[8]);
        expect(result.email).toBe(origValues[9]);
        expect(result.birthdate).toBe(origValues[10]);
        expect(result.dateJoined).toBe(origValues[11]);
        expect(result.address).toBe(origValues[12]);
        expect(result.city).toBe(origValues[13]);
        expect(result.state).toBe(origValues[14]);
        expect(result.zip).toBe(origValues[15]);
        expect(result.lastModifiedDate).toBe(origValues[16]);
        expect(result.lastModifiedBy).toBe(origValues[17]);
    });

    it('Throws for member not found', async () => {
        const memberId = '765';
        await expect(getMember(memberId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const memberId = '-100';
        await expect(getMember(memberId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('patchMember()', () => {
    const testPatchWithObject = async (req: PatchMemberRequest) => {
        const memberId = '42';
        // no error means success
        await patchMember(memberId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a member with membershipId field', async () => {
        await testPatchWithObject({ membershipId: 0, modifiedBy: 0 });
    });

    it('Patches a member with uuid field', async () => {
        await testPatchWithObject({ uuid: '', modifiedBy: 0 });
    });

    it('Patches a member with active field', async () => {
        await testPatchWithObject({ active: false, modifiedBy: 0 });
    });

    it('Patches a member with memberTypeId field', async () => {
        await testPatchWithObject({ memberTypeId: 0, modifiedBy: 0 });
    });

    it('Patches a member with firstName field', async () => {
        await testPatchWithObject({ firstName: '', modifiedBy: 0 });
    });

    it('Patches a member with lastName field', async () => {
        await testPatchWithObject({ lastName: '', modifiedBy: 0 });
    });

    it('Patches a member with phoneNumber field', async () => {
        await testPatchWithObject({ phoneNumber: '', modifiedBy: 0 });
    });

    it('Patches a member with occupation field', async () => {
        await testPatchWithObject({ occupation: '', modifiedBy: 0 });
    });

    it('Patches a member with email field', async () => {
        await testPatchWithObject({ email: '', modifiedBy: 0 });
    });

    it('Patches a member with birthdate field', async () => {
        await testPatchWithObject({ birthdate: '', modifiedBy: 0 });
    });

    it('Patches a member with dateJoined field', async () => {
        await testPatchWithObject({ dateJoined: '', modifiedBy: 0 });
    });

    it('Throws for user error', async () => {
        const memberId = '1451';
        await expect(patchMember(memberId, { modifiedBy: 0 })).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for member not found', async () => {
        const memberId = '3000';
        await expect(patchMember(memberId, { modifiedBy: 0 })).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const memberId = '-100';
        await expect(patchMember(memberId, { modifiedBy: 0 })).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const memberId = '-200';
        await expect(patchMember(memberId, { modifiedBy: 0 })).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});
