import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { CognitoJwtVerifierSingleUserPool } from 'aws-jwt-verify/cognito-verifier';
import { CognitoIdTokenPayload } from 'aws-jwt-verify/jwt-model';
import { mock } from 'jest-mock-extended';

export const mockedType =
    mock<CognitoJwtVerifierSingleUserPool<{ userPoolId: string; tokenUse: 'id'; clientId: string; }>>();
export const mockedPayloadType = mock<CognitoIdTokenPayload>();
mockedPayloadType['cognito:username'] = 'thisIsAUuid';
export const mockInvalidToken = mockedType.verify.calledWith('invalidtoken')
    .mockRejectedValue(new Error('Authorization Failed'));
export const mockValidToken = mockedType.verify.calledWith('validtoken').mockResolvedValue(mockedPayloadType);

export const mockedPayloadNoMember = mock<CognitoIdTokenPayload>();
mockedPayloadNoMember['cognito:username'] = 'invaliduuid';
export const mockVerifyNoMember = mockedType.verify.calledWith('nomember').mockResolvedValue(mockedPayloadNoMember);

export const mockedPayloadAdmin = mock<CognitoIdTokenPayload>();
mockedPayloadAdmin['cognito:username'] = '7b';
export const mockVerifyAdmin = mockedType.verify.calledWith('admin').mockResolvedValue(mockedPayloadAdmin);

export const mockedPayloadMembershipAdmin = mock<CognitoIdTokenPayload>();
mockedPayloadMembershipAdmin['cognito:username'] = '12c';
export const mockVerifyMembershipAdmin =
    mockedType.verify.calledWith('membershipAdmin').mockResolvedValue(mockedPayloadMembershipAdmin);

export const mockedPayloadMember = mock<CognitoIdTokenPayload>();
mockedPayloadMember['cognito:username'] = '28m';
export const mockVerifyMember = mockedType.verify.calledWith('member').mockResolvedValue(mockedPayloadMember);

export const mockedPayloadLaborer = mock<CognitoIdTokenPayload>();
mockedPayloadLaborer['cognito:username'] = 'oo7';
export const mockVerifyLaborer = mockedType.verify.calledWith('laborer').mockResolvedValue(mockedPayloadLaborer);

export const createSpy = jest.spyOn(CognitoJwtVerifier, 'create').mockImplementation(() => mockedType);
