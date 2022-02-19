import 'dotenv/config'; // need env to be properly configured
import { checkHeader, createVerifier, destroyVerifier, HeaderCheck, verify } from '../../util/auth';
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
    destroyVerifier();
});

describe('setupVerifier()', () => {
    it('errors without pool id', () => {
        process.env.COGNITO_POOL_ID = '';
        expect(() => {
            createVerifier();
        }).toThrow('Auth setup failed to missing pool ID');
    });

    it('errors without client id', () => {
        process.env.COGNITO_CLIENT_ID = '';
        expect(() => {
            createVerifier();
        }).toThrow('Auth setup failed to missing client ID');
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
        expect(payload).toEqual(mockedPayloadType);
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
    });
});
