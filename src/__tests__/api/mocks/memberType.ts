import _ from 'lodash';
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

export const mockGetMemberType = jest.spyOn(memberType, 'getMemberType').mockImplementation((memebrTypeId: number) => {
    let returnType: MemberType[] = [];
    if (memebrTypeId === 400) {
        throw new Error('internal server error');
    }
    returnType = _.filter(memberTypeList, (mem: MemberType) => mem.memberTypeId === memebrTypeId);

    if (returnType.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnType[0]);
});
