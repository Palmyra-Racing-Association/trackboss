import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import logger from '../logger';

let verifier: CognitoJwtVerifierSingleUserPool<{ userPoolId: string; tokenUse: 'id'; clientId: string; }> | null;

const createVerifier = () => {
    if (!process.env.COGNITO_POOL_ID) {
        logger.error('No Cognito User Pool ID specified in environment');
        throw new Error('Auth setup failed to missing pool ID');
    }
    if (!process.env.COGNITO_CLIENT_ID) {
        logger.error('No Cognito Client ID in environment');
        throw new Error('Auth setup failed to missing client ID');
    }
    verifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_POOL_ID,
        tokenUse: 'id',
        clientId: process.env.COGNITO_CLIENT_ID,
    });
};

const destroyVerifier = () => {
    verifier = null;
};

const verify = async (token: string) => {
    if (!verifier) {
        throw new Error('Attempted to use verifier before it was created');
    }
    try {
        // eslint-disable-next-line max-len
        // const token = 'eyJraWQiOiJsODNDWStqWndmZWdwXC9WcGk3S3ZRNFg2TjA1VlloanpQT09OVnE0NGRUZz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiZDc0MkE4aEJPU2tHbHNZdm1XbkgydyIsInN1YiI6IjZlOTliM2ZkLTU3NzEtNDQ4NC04MDRjLTJhNDJmODA3ZTM2NSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9YUlZYTDFmUUYiLCJjb2duaXRvOnVzZXJuYW1lIjoiNmU5OWIzZmQtNTc3MS00NDg0LTgwNGMtMmE0MmY4MDdlMzY1IiwiYXVkIjoiM3E3aWxlODBkMnFrNGJndDc1YWY5Njg0YnEiLCJldmVudF9pZCI6IjJjODMxNDNkLWFmMjktNDlkYS1hZDZiLTQ1ZWM3NWFlNGY0NCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjQ1MTI3MjkwLCJleHAiOjE2NDUxMzA4OTAsImlhdCI6MTY0NTEyNzI5MCwianRpIjoiZjE1YmVlMGUtODBiMy00YWNmLTkzMTEtZGZiODFlNmU1YWMwIiwiZW1haWwiOiJjanM4NDg3QHJpdC5lZHUifQ.geQ0rDkQW_fVLE72yGfPxq_NYsngRSFduBvUGHleQicy31IjPMU72tRELFQcvooJ7qqFH5wK8SO9w3wjoA455HTP3lc5ji6ps87t044Qd_Azgxzds_tSi-nzBh5Ep605MVEF4FSNjZsEbFnPrg2pY8Fll0xPmv1qkCBsJbfrI2tm1wLDKl0_IuspseOz1Rc_nMY1p5eyZdgUH_LJtVh7PRrcqjZYMbZyha2WZxgatsOfpNErIcY9Y86tCnJGTx_YWbuYEqCRpb8v1NOTfhkdfVp6diUiDo5cofXk1GlsMLlwlc2egUjYC22Im2LcEazxWVW1dDmq-GJbXkJvc2djWA';
        const payload = await verifier.verify(token);
        logger.info(JSON.stringify(payload));
        return payload;
    } catch (e) {
        logger.error('invalid token');
        logger.error(e);
        throw new Error('Authorization Failed');
    }
};

export type HeaderCheck = {
    valid: boolean,
    reason: string,
    token: string
};

const checkHeader = (header?: string): HeaderCheck => {
    let valid;
    let reason = '';
    let token = '';
    if (typeof header === 'undefined') {
        return {
            valid: false,
            reason: 'Missing authorization grant in header',
            token: '',
        };
    }
    const parts = header.split(' ');
    const [type, headerToken] = parts;
    if (parts.length !== 2) {
        valid = false;
        reason = 'Authorization grant in header has invalid structure';
    } else if (type !== 'Bearer') {
        valid = false;
        reason = 'Incorrect token type in authorization grant';
    } else {
        valid = true;
        reason = '';
        [token] = headerToken;
    }
    return { valid, reason, token };
};

export { checkHeader, createVerifier, destroyVerifier, verify };
