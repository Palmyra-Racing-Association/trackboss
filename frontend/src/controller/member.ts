import { generateHeaders } from './utils';
import {
    GetMemberListResponse,
    GetMemberResponse,
    Member,
    PatchMemberRequest,
    PatchMemberResponse,
    PostNewMemberRequest,
    PostNewMemberResponse,
} from '../../../src/typedefs/member';

export async function createMember(token: string, memberData: PostNewMemberRequest): Promise<PostNewMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

export async function getMember(token: string, memberId: number): Promise<GetMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberId}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

// TODO: this is a mock response, redo when API is completed
export async function getFamilyMembers() {
    return [
        {
            member_id: 1,
            name: 'Billy Joel',
        },
        {
            member_id: 2,
            name: 'Jimmi Hendrix',
        },
        {
            member_id: 3,
            name: 'Elvis',
        },
        {
            member_id: 4,
            name: 'Ringo Starr',
        },
    ];
}

export async function getMemberList(token: string, listType?: string): Promise<GetMemberListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list?status=${listType}`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateMember(
    token: string,
    memberID: number,
    memberData: PatchMemberRequest,
): Promise<PatchMemberResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/${memberID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(memberData),
    });
    return response.json();
}

// this is a mocked api call
// TODO: change this when the api is done
export async function getName() {
    const response = {
        name: 'Martin',
    };

    return response.name;
}

// this api call is mocked
// TODO: replace with getMemberList() call when api is done
// eslint-disable-next-line no-unused-vars
export function getFormattedMemberList(token: string): Member[] {
    // const response =  getMemberList(token);
    const response: Member[] = [
        {
            memberId: 1,
            membershipId: 1,
            membershipAdmin: 'true',
            active: true,
            memberType: 'admin',
            firstName: 'Alan',
            lastName: 'Delimon',
            phoneNumber: '1',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 2,
            membershipId: 2,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'John',
            lastName: 'Smith',
            phoneNumber: '2',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 3,
            membershipId: 2,
            membershipAdmin: 'true',
            active: true,
            memberType: 'admin',
            firstName: 'Sarah',
            lastName: 'Connors',
            phoneNumber: '3',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 4,
            membershipId: 1,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'Jim',
            lastName: 'Smith',
            phoneNumber: '4',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 5,
            membershipId: 3,
            membershipAdmin: 'true',
            active: true,
            memberType: 'member',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNumber: '5',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 6,
            membershipId: 3,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'Jannet',
            lastName: 'Smith',
            phoneNumber: '6',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 7,
            membershipId: 3,
            membershipAdmin: 'true',
            active: true,
            memberType: 'admin',
            firstName: 'Alan',
            lastName: 'Delimon',
            phoneNumber: '7',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 8,
            membershipId: 3,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'John',
            lastName: 'Smith',
            phoneNumber: '8',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 9,
            membershipId: 6,
            membershipAdmin: 'true',
            active: true,
            memberType: 'admin',
            firstName: 'Sarah',
            lastName: 'Connors',
            phoneNumber: '9',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 10,
            membershipId: 4,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'Jim',
            lastName: 'Smith',
            phoneNumber: '10',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 11,
            membershipId: 4,
            membershipAdmin: 'true',
            active: true,
            memberType: 'member',
            firstName: 'Jane',
            lastName: 'Smith',
            phoneNumber: '11',
            email: 'user@example.com',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
        {
            memberId: 12,
            membershipId: 5,
            membershipAdmin: 'string',
            active: true,
            memberType: 'member',
            firstName: 'test',
            lastName: 'test',
            phoneNumber: '12',
            email: 'test',
            uuid: '',
            occupation: '',
            birthdate: '',
            dateJoined: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            lastModifiedDate: '',
            lastModifiedBy: '',
        },
    ];

    return response;
}
