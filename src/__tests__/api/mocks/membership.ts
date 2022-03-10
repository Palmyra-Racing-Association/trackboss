import _ from 'lodash';
import * as membership from '../../../database/membership';
import { Membership, PatchMembershipRequest, PostNewMembershipRequest } from '../../../typedefs/membership';

export const membershipList: Membership[] = [
    {
        membershipId: 0,
        membershipAdmin: 'Criminy Jicket',
        status: 'Active',
        curYearRenewed: true,
        renewalSent: true,
        yearJoined: 2022,
        address: 'the ground',
        city: 'or wherever',
        state: 'jickets',
        zip: 'live',
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Nipocchio',
    },
    {
        membershipId: 1,
        membershipAdmin: 'Gilgo Gabbins',
        status: 'Pending',
        curYearRenewed: true,
        renewalSent: true,
        yearJoined: 2022,
        address: 'his house',
        city: 'the shire',
        state: 'uhhh the shire',
        zip: "what's a zip",
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Dangalf',
    },
    {
        membershipId: 2,
        membershipAdmin: 'Skykin Anawalker',
        status: 'Disabled',
        curYearRenewed: true,
        renewalSent: true,
        yearJoined: 2022,
        address: 'right off a lava river',
        city: 'the low ground',
        state: 'mustafar',
        zip: '¯\\_(ツ)_/¯',
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Lurge Geocas',
    },
];

export const mockInsertMembership = jest.spyOn(membership, 'insertMembership').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((req: PostNewMembershipRequest): Promise<number> => {
    const newMembership = {
        membershipId: 3,
        membershipAdmin: 'Wohn Jilliams',
        status: 'Pending',
        curYearRenewed: false,
        renewalSent: false,
        yearJoined: req.yearJoined || 2022,
        address: req.address || '',
        city: req.city || '',
        state: req.state || '',
        zip: req.zip || '',
        lastModifiedDate: '2022-03-09',
        lastModifiedBy: 'Speven Stielberg',
    };
    return Promise.resolve(membershipList.push(newMembership) - 1);
});

export const mockGetMembership = jest.spyOn(membership, 'getMembership').mockImplementation((membershipId: number) => {
    let returnMembership: Membership[] = [];
    if (membershipId === 400) {
        throw new Error('internal server error');
    }
    returnMembership = _.filter(membershipList, (mem: Membership) => mem.membershipId === membershipId);

    if (returnMembership.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnMembership[0]);
});

export const mockGetMembershipList = jest.spyOn(membership, 'getMembershipList').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((status?: string): Promise<Membership[]> => {
    let memberships: Membership[] = [];
    if (typeof status === 'undefined') {
        memberships = membershipList;
    } else {
        const statusMap = new Map([
            ['active', 'Active'],
            ['inactive', 'Disabled'],
            ['pending', 'Pending'],
        ]);
        memberships = _.filter(membershipList, (b: Membership) => b.status === statusMap.get(status));
    }
    return Promise.resolve(memberships);
});

export const mockGetRegistration = jest.spyOn(membership, 'getRegistration').mockImplementation(() => Promise.resolve({
    memberType: 'member',
    firstName: 'Pewlett',
    lastName: 'Hackard',
    phoneNumber: '650-857-1501',
    occupation: 'Printer Bug Writer',
    email: 'printerbreaker@ph.com',
    birthdate: '1970-01-01',
    address: '1501 Page Mill Road',
    city: 'Palo Alto',
    state: 'CA',
    zip: '94304',
}));

export const mockPatchMembership = jest.spyOn(membership, 'patchMembership').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (membershipId: number, req: PatchMembershipRequest): Promise<void> => {
    const filtered = _.filter(membershipList, (b: Membership) => b.membershipId === membershipId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    membershipList[membershipId] = {
        ...membershipList[membershipId],
        ...req,
    };
});

export const mockRegisterMembership = jest.spyOn(membership, 'registerMembership').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementationOnce((): Promise<number> => {
    throw new Error('user input error');
}).mockImplementation((): Promise<number> => Promise.resolve(0));
