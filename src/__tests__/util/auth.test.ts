import 'dotenv/config'; // need env to be properly configured
import { checkHeader, createVerifier, HeaderCheck, verify } from '../../util/auth';
import { mockGetMember, mockGetValidActors } from '../api/mocks/member';
import { createSpy, mockedPayloadType, mockInvalidToken } from './authMocks';

let actualPoolId: string | undefined;
let actualClientId: string | undefined;

// store env so it can be restored later
beforeEach(() => {
    actualPoolId = process.env.COGNITO_POOL_ID;
    actualClientId = process.env.COGNITO_CLIENT_ID;
});

// restore env after tests so it is correct for each other test
afterEach(() => {
    process.env.COGNITO_POOL_ID = actualPoolId;
    process.env.COGNITO_CLIENT_ID = actualClientId;
});

describe('setupVerifier()', () => {
    it('errors without pool id', () => {
        process.env.COGNITO_POOL_ID = '';
        expect(() => {
            createVerifier();
        }).toThrow('Auth setup failed due to missing pool ID');
    });

    it('errors without client id', () => {
        process.env.COGNITO_CLIENT_ID = '';
        expect(() => {
            createVerifier();
        }).toThrow('Auth setup failed due to missing client ID');
    });

    it('successfully loads', () => {
        expect(() => {
            createVerifier();
        }).not.toThrow();
    });
});

describe('verify()', () => {
    it('fails with no verifier', async () => {
        await expect(verify('validtoken')).rejects.toThrow('Attempted to use verifier before it was created');
    });

    it('fails with an invalid token', async () => {
        createVerifier();
        expect(createSpy).toHaveBeenCalled();
        await expect(verify('invalidtoken')).rejects.toThrow('Authorization Failed');
        expect(mockInvalidToken).toHaveBeenCalled();
    });

    it('succeeds with a valid token', async () => {
        createVerifier();
        expect(createSpy).toHaveBeenCalled();
        const payload = await verify('validtoken');
        expect(mockGetMember).not.toHaveBeenCalled();
        expect(payload).toEqual(mockedPayloadType);
    });

    it('succeeds for admin-admin', async () => {
        createVerifier();
        await verify('admin', 'Admin');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for admin-membership admin', async () => {
        createVerifier();
        await verify('admin', 'Membership Admin');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for admin-member', async () => {
        createVerifier();
        await verify('admin', 'Member');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for admin-laborer', async () => {
        createVerifier();
        await verify('admin', 'Paid Laborer');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for membership admin-admin', async () => {
        createVerifier();
        await expect(verify('membershipAdmin', 'Admin')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for membership admin-membership admin on same membership', async () => {
        createVerifier();
        await verify('membershipAdmin', 'Membership Admin');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for membership admin-membership admin on different membership', async () => {
        createVerifier();
        await expect(verify('membershipAdmin', 'Membership Admin', 0)).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for membership admin-member on same membership', async () => {
        createVerifier();
        await verify('membershipAdmin', 'Member');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for membership admin-member on different membership', async () => {
        createVerifier();
        await verify('membershipAdmin', 'Member');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for membership admin-laborer', async () => {
        createVerifier();
        await verify('membershipAdmin', 'Paid Laborer');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for member-admin', async () => {
        createVerifier();
        await expect(verify('member', 'Admin')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for member-membership admin', async () => {
        createVerifier();
        await expect(verify('member', 'Membership Admin')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for member-member on self', async () => {
        createVerifier();
        await verify('member', 'Member');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for member-member on other member', async () => {
        createVerifier();
        await expect(verify('member', 'Member', 0)).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for member-laborer', async () => {
        createVerifier();
        await verify('admin', 'Paid Laborer');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for laborer-admin', async () => {
        createVerifier();
        await expect(verify('laborer', 'Admin')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for laborer-membership admin', async () => {
        createVerifier();
        await expect(verify('laborer', 'Membership Admin')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('fails for laborer-member', async () => {
        createVerifier();
        await expect(verify('laborer', 'Member')).rejects.toThrow('Forbidden');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });

    it('succeeds for laborer-laborer', async () => {
        createVerifier();
        await verify('laborer', 'Paid Laborer');
        expect(mockGetValidActors).not.toHaveBeenCalled();
        expect(mockGetMember).toHaveBeenCalled();
    });
});

describe('checkHeader()', () => {
    it('returns invalid with missing grant', () => {
        const check: HeaderCheck = checkHeader();
        expect(check.valid).toBeFalsy();
        expect(check.reason).toBe('Missing authorization grant in header');
    });
    it('returns invlaid with an invalid structure', () => {
        const check: HeaderCheck = checkHeader('bad');
        expect(check.valid).toBeFalsy();
        expect(check.reason).toBe('Authorization grant in header has invalid structure');
    });
    it('returns invlaid with an bad token type', () => {
        const check: HeaderCheck = checkHeader('Bad Token');
        expect(check.valid).toBeFalsy();
        expect(check.reason).toBe('Incorrect token type in authorization grant');
    });
    it('returns valid with correct structure', () => {
        const check: HeaderCheck = checkHeader('Bearer Token');
        expect(check.valid);
        expect(check.reason).toBe('');
        expect(check.token).toBe('Token');
    });
});
