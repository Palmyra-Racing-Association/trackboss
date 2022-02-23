import { generateHeaders } from './utils';
import {
    GetMemberListResponse,
    GetMemberResponse,
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
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/member/list`, {
        method: 'GET',
        mode: 'no-cors',
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

interface Member {
    id: number,
    name: string,
    role: string,
}

// eslint-disable-next-line no-unused-vars
export function getFormattedMemberList(token: string): Member[] {
    // const response =  getMemberList(token);
    const response = [
        {
            memberId: 1,
            memberType: 'Admin',
            firstName: 'Alan',
            lastName: 'Delimon',
        },
        {
            memberId: 2,
            memberType: 'Member',
            firstName: 'Martin',
            lastName: 'Smith',
        },
        {
            memberId: 3,
            memberType: 'President',
            firstName: 'Jimmy',
            lastName: 'Hendrix',
        },
        {
            memberId: 4,
            memberType: 'Secretary',
            firstName: 'Brandon',
            lastName: 'Sanderson',
        },
        {
            memberId: 5,
            memberType: 'Member',
            firstName: 'Marianna',
            lastName: 'Moreno',
        },
        {
            memberId: 6,
            memberType: 'Member',
            firstName: 'Kason',
            lastName: 'Rosales',
        },
        {
            memberId: 7,
            memberType: 'Member',
            firstName: 'Opal',
            lastName: 'Wormald',
        },
        {
            memberId: 8,
            memberType: 'Member',
            firstName: 'Cerys',
            lastName: 'Mcpherson',
        },
        {
            memberId: 9,
            memberType: 'Member',
            firstName: 'Lewys',
            lastName: 'Cope',
        },
        {
            memberId: 10,
            memberType: 'Member',
            firstName: 'Salim',
            lastName: 'Stafford',
        },
        {
            memberId: 11,
            memberType: 'Admin',
            firstName: 'Taha',
            lastName: 'Davila',
        },
        {
            memberId: 12,
            memberType: 'Member',
            firstName: 'Hari',
            lastName: 'Acevedo',
        },

    ];

    const formattedResponse = response.map((member) => (
        {
            id: member.memberId,
            name: `${member.firstName} ${member.lastName}`,
            role: member.memberType,
        }
    ));

    return formattedResponse;
}
