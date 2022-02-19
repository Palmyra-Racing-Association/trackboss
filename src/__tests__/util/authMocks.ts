import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { mock } from 'jest-mock-extended';

export const mockedType =
    mock<CognitoJwtVerifierSingleUserPool<{ userPoolId: string; tokenUse: 'id'; clientId: string; }>>();
export const mockedPayloadType = mock<CognitoIdTokenPayload>();
mockedPayloadType['cognito:username'] = 'thisIsAUuid';
export const mockInvalidToken = mockedType.verify.calledWith('invalidtoken').mockRejectedValue('');
export const mockValidToken = mockedType.verify.calledWith('validtoken').mockResolvedValue(mockedPayloadType);

export const mockedPayloadNoMember = mock<CognitoIdTokenPayload>();
mockedPayloadNoMember['cognito:username'] = 'invaliduuid';
export const mockVerifyNoMember = mockedType.verify.calledWith('nomember').mockResolvedValue(mockedPayloadNoMember);

export const createSpy = jest.spyOn(CognitoJwtVerifier, 'create').mockImplementation(() => mockedType);
