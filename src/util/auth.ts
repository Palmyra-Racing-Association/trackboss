import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { getMember, getValidActors } from '../database/member';
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

const verify = async (token: string, permissionLevel?: string, targetActingAs?: number) => {
    if (!verifier) {
        throw new Error('Attempted to use verifier before it was created');
    }
    try {
        const payload = await verifier.verify(token);
        if (permissionLevel) {
            const member = await getMember(payload['cognito:username']);
            let actingAs = targetActingAs;
            if (typeof actingAs === 'undefined') {
                actingAs = member.memberId;
            }
            if (permissionLevel === 'Admin') {
                if (member.memberType !== 'Admin') {
                    throw new Error('Not Authorized');
                }
            } else if (permissionLevel === 'Membership Admin') {
                if (member.memberType !== 'Admin') {
                    if (member.memberType === 'Membership Admin') {
                        // make sure they have permission to act on this
                        const validActors: number[] = await getValidActors(actingAs);
                        if (!validActors.includes(member.memberId)) {
                            throw new Error('Not Authorized');
                        }
                    } else {
                        throw new Error('Not Authorized');
                    }
                }
            } else if (permissionLevel === 'Member') {
                if (member.memberType === 'Paid Laborer') {
                    throw new Error('Not Authorized');
                }
                if (member.memberType !== 'Admin') {
                    // check that they have permission to act on this
                    const validActors = await getValidActors(actingAs);
                    if (!validActors.includes(member.memberId)) {
                        throw new Error('Not Authorized');
                    }
                }
            }
        }
        logger.info(JSON.stringify(payload));
        return payload;
    } catch (e: any) {
        logger.error('invalid token');
        logger.error(e);
        // console.log(e);
        if (e.message === 'Not Authorized') {
            throw new Error('Not Authorized');
        }
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
        token = headerToken;
    }
    return { valid, reason, token };
};

export { checkHeader, createVerifier, destroyVerifier, verify };
