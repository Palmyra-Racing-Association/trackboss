import _ from 'lodash';
import * as member from '../../../database/member';
import { GetMemberListFilters, Member, PatchMemberRequest, PostNewMemberRequest } from '../../../typedefs/member';

export const memberList: Member[] = [
    {
        memberId: 0,
        membershipId: 1,
        membershipAdmin: 'Joe Blow',
        uuid: '7b',
        active: true,
        memberType: 'Admin',
        firstName: 'Joe',
        lastName: 'Blow',
        phoneNumber: '999-999-9999',
        occupation: 'Student',
        email: 'joe@blow.com',
        birthdate: '1998-04-15',
        dateJoined: '2020-01-01',
        address: '12 Street Road',
        city: 'Rochester',
        state: 'NY',
        zip: '14623',
        lastModifiedDate: '2022-02-12',
        lastModifiedBy: 'Joe Blow',
    },
    {
        memberId: 1,
        membershipId: 2,
        membershipAdmin: 'Guy Fieri',
        uuid: '12c',
        active: true,
        memberType: 'Membership Admin',
        firstName: 'Guy',
        lastName: 'Fieri',
        phoneNumber: '999-999-9998',
        occupation: 'Chef',
        email: 'guy@flavortown.com',
        birthdate: '1968-01-22',
        dateJoined: '2021-01-01',
        address: '323 Spice Street',
        city: 'Flavor Town',
        state: 'CA',
        zip: '03547',
        lastModifiedDate: '2022-01-19',
        lastModifiedBy: 'Joe Blow',
    },
    {
        memberId: 2,
        membershipId: 2,
        membershipAdmin: 'Guy Fieri',
        uuid: '28m',
        active: true,
        memberType: 'Member',
        firstName: 'Jackie',
        lastName: 'Chan',
        phoneNumber: '999-999-9997',
        occupation: 'Fighter',
        email: 'jackie@kungfu.org',
        birthdate: '1954-04-07',
        dateJoined: '2022-01-08',
        address: '12 Fighty Way',
        city: 'Madison',
        state: 'WI',
        zip: '22236',
        lastModifiedDate: '2022-01-19',
        lastModifiedBy: 'Joe Blow',
    },
    {
        memberId: 3,
        membershipId: 3,
        membershipAdmin: '',
        uuid: 'oo7',
        active: true,
        memberType: 'Paid Laborer',
        firstName: 'James',
        lastName: 'Bond',
        phoneNumber: '999-007-9996',
        occupation: 'REDACTED',
        email: 'redacted@redacted.redacted',
        birthdate: '1970-07-01',
        dateJoined: '2019-05-03',
        address: 'REDACTED',
        city: 'REDACTED',
        state: 'REDACTED',
        zip: 'REDACTED',
        lastModifiedDate: '2022-02-01',
        lastModifiedBy: 'Joe Blow',
    },
];

export const mockInsertMember = jest.spyOn(member, 'insertMember').mockImplementationOnce((): Promise<number> => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((req: PostNewMemberRequest): Promise<number> => {
    const newMember = {
        uuid: req.uuid as string,
        membershipId: req.membershipId as number,
        firstName: req.firstName as string,
        lastName: req.lastName as string,
        phoneNumber: req.phoneNumber as string,
        dateJoined: req.dateJoined as string,
        birthdate: req.birthdate as string,
        occupation: req.occupation as string,
        email: req.email as string,
        memberId: memberList.length,
        active: true,
        membershipAdmin: '',
        memberType: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedBy: '',
        lastModifiedDate: '2022-02-12',
    };
    return Promise.resolve(memberList.push(newMember) - 1);
});

export const mockGetMemberList =
    jest.spyOn(member, 'getMemberList').mockImplementationOnce((): Promise<Member[]> => {
        throw new Error('internal server error');
    }).mockImplementation((filters: GetMemberListFilters): Promise<Member[]> => {
        let members: Member[] = memberList;
        const { type, membershipId } = filters;
        if (typeof type !== 'undefined') {
            members = _.filter(
                members,
                (mem: Member) => mem.memberType === member.MEMBER_TYPE_MAP.get(type),
            );
        }
        if (typeof membershipId !== 'undefined') {
            let targetAdmin: string;
            if (membershipId === 0) {
                targetAdmin = 'Joe Blow';
            } else {
                targetAdmin = 'Guy Fieri';
            }
            members = _.filter(members, (mem: Member) => mem.membershipAdmin === targetAdmin);
        }
        return Promise.resolve(members);
    });

export const mockGetMember = jest.spyOn(member, 'getMember').mockImplementation((id: string): Promise<Member> => {
    let returnMemeber: Member[] = [];
    const memberId = Number(id);
    if (Number.isNaN(memberId)) {
        returnMemeber = _.filter(memberList, (mem: Member) => mem.uuid === id);
    } else {
        if (memberId === 400) {
            throw new Error('internal server error');
        }
        returnMemeber = _.filter(memberList, (mem: Member) => mem.memberId === memberId);
    }
    if (returnMemeber.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnMemeber[0]);
});

export const mockPatchMember = jest.spyOn(member, 'patchMember').mockImplementationOnce((): Promise<void> => {
    throw new Error('internal server error');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (id: string, req: PatchMemberRequest): Promise<void> => {
    const memberId = Number(id);
    let filtered;
    if (Number.isNaN(memberId)) {
        filtered = _.filter(memberList, (mem: Member) => mem.uuid === id);
    } else {
        filtered = _.filter(memberList, (mem: Member) => mem.memberId === memberId);
    }
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    memberList[memberId] = {
        ...memberList[memberId],
        ...req,
    };
});

export const mockGetValidActors = jest.spyOn(member, 'getValidActors')
    .mockImplementation((memberId: number): Promise<number[]> => {
        switch (memberId) {
            case 0:
                return Promise.resolve([0]);
            case 1:
                return Promise.resolve([0, 1]);
            case 2:
                return Promise.resolve([0, 1, 2]);
            case 3:
                return Promise.resolve([0, 3]);
            default:
                return Promise.resolve([]);
        }
    });
