import 'dotenv/config';

import { PatchMemberTypeRequest } from '../../../typedefs/memberType';
import { getMemberType, getMemberTypeList, patchMemberType } from '../../../database/memberType';
import { mockQuery } from './mockQuery';

describe('getMemberType()', () => {
    it('Selects a single member type', async () => {
        const expMemberType = {
            memberTypeId: 8,
            type: 'Test Subject',
            baseDuesAmt: 100,
        };
        const result = await getMemberType(expMemberType.memberTypeId);
        expect(mockQuery).toHaveBeenCalled();
        expect(result).toEqual(expMemberType);
    });

    it('Throws for member type not found', async () => {
        const memberTypeId = 765;
        await expect(getMemberType(memberTypeId)).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const memberTypeId = -100;
        await expect(getMemberType(memberTypeId)).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('getMemberTypeList()', () => {
    it('Returns an unfiltered list of member types', async () => {
        const results = await getMemberTypeList();
        expect(mockQuery).toHaveBeenCalled();
        expect(results.length).toBeGreaterThan(1);
    });
});

describe('patchMemberType()', () => {
    const testPatchWithObject = async (req: PatchMemberTypeRequest) => {
        const memberTypeId = 10;
        // no error means success
        await patchMemberType(memberTypeId, req);
        expect(mockQuery).toHaveBeenCalled();
    };

    it('Patches a member type with type field', async () => {
        await testPatchWithObject({ type: '2000' });
    });

    it('Patches a member type with baseDuesAmt field', async () => {
        await testPatchWithObject({ baseDuesAmt: 123.45 });
    });

    it('Patches a member type with type and baseDuesAmt field', async () => {
        await testPatchWithObject({ type: 'Test', baseDuesAmt: 67.89 });
    });

    it('Throws for member type not found', async () => {
        const memberTypeId = 3000;
        await expect(patchMemberType(memberTypeId, {})).rejects.toThrow('not found');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for user error', async () => {
        const memberTypeId = 4000;
        await expect(patchMemberType(memberTypeId, {})).rejects.toThrow('user input error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws for internal server error', async () => {
        const memberTypeId = -100;
        await expect(patchMemberType(memberTypeId, {})).rejects.toThrow('internal server error');
        expect(mockQuery).toHaveBeenCalled();
    });

    it('Throws unreachable error without errno field', async () => {
        const memberTypeId = -200;
        await expect(patchMemberType(memberTypeId, {})).rejects.toThrow('this error should not happen');
        expect(mockQuery).toHaveBeenCalled();
    });
});
