export type Member = {
    memberId: number,
    membershipAdmin: string,
    uuid: string,
    active: true,
    memberType: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: Date,
    dateJoined: Date,
    address: string,
    city: string,
    state: string,
    zip: string,
    lastModifiedDate: Date,
    lastModifiedBy: string
  }

export type PostNewMemberRequest = {
    membershipId: number,
    uuid: string,
    memberTypeId: number,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    occupation: string,
    email: string,
    birthdate: Date,
    dateJoined: Date,
    modifiedBy: number
}

export type PostNewMemberResponse = Member;

export type GetMemberRequest = {}

export type GetMemberResponse = Member

export type PatchMemberRequest = {
    memberId?: number,
    membershipAdmin?: string,
    uuid?: string,
    active?: true,
    memberType?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    occupation?: string,
    email?: string,
    birthdate?: Date,
    dateJoined?: Date,
    address?: string,
    city?: string,
    state?: string,
    zip?: string,
    lastModifiedDate?: Date,
    lastModifiedBy?: string
}

export type PatchMemberResponse = Member;

export type GetMemberListRequest = {}

export type GetMemberListResponse = Member[];
