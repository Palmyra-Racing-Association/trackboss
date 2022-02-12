import _ from 'lodash';
import * as member from '../../../database/member';
import { Member } from '../../../typedefs/member';

export const memberList: Member[] = [
    {
        memberId: 1,
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
        memberId: 2,
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
        memberId: 3,
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
        memberId: 4,
        membershipAdmin: '',
        uuid: '007',
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

export const mockGetMemberList =
    jest.spyOn(member, 'getMemberList').mockImplementationOnce((): Promise<Member[]> => {
        throw new Error('internal server error');
    }).mockImplementation((type?: string): Promise<Member[]> => {
        let members: Member[];
        if (typeof type === 'undefined') {
            members = memberList;
        } else {
            members = _.filter(memberList, (mem: Member) => mem.memberType === member.MEMBER_TYPE_MAP.get(type));
        }
        return Promise.resolve(members);
    });

export const mockGetMember = jest.spyOn(member, 'getMember').mockImplementationOnce((): Promise<Member> => {
    throw new Error('internal server error');
}).mockImplementation((id: string): Promise<Member> => {
    let returnMemeber: Member[] = [];
    // TODO: UUID CASE
    const memberId = parseInt(id, 10);
    returnMemeber = _.filter(memberList, (mem: Member) => mem.memberId === memberId);
    if (returnMemeber.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnMemeber[0]);
});
