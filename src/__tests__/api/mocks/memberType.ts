import * as memberType from '../../../database/memberType';
import { MemberType } from '../../../typedefs/memberType';

export const memberTypeList: MemberType[] = [
    {
        memberTypeId: 0,
        type: 'Admin',
        baseDuesAmt: 100,
    },
    {
        memberTypeId: 1,
        type: 'Membership Admin',
        baseDuesAmt: 500,
    },
    {
        memberTypeId: 2,
        type: 'Member',
        baseDuesAmt: 500,
    },
    {
        memberTypeId: 3,
        type: 'Paid Laboroer',
        baseDuesAmt: 0,
    },
];

export const mockGetMemberTypeList = jest.spyOn(memberType, 'getMemberTypeList').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((): Promise<MemberType[]> => Promise.resolve(memberTypeList));
