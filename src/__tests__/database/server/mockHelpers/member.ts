/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getMemberListResponse(values: string[]) {
    const memberList = [
        {
            member_id: 1,
            member_type: 'Admin',
            active: [1],
        }, {
            member_id: 2,
            member_type: 'Membership Admin',
            active: [1],
        }, {
            member_id: 3,
            member_type: 'Member',
            active: [1],
        }, {
            member_id: 4,
            member_type: 'Paid Laborer',
            active: [1],
        },
    ];

    if (values.length === 0) {
        return Promise.resolve([memberList]);
    }
    if (values[0] === 'ise') {
        throw new Error('error message');
    }

    return Promise.resolve([memberList.filter((member) => member.member_type === values[0])]);
}

export function getMemberResponse(id: number) {
    switch (id) {
        case 18:
            return Promise.resolve([[{
                member_id: 18,
                membership_admin: 'membershipAdmin',
                uuid: 'thisIsAUuid',
                active: [1],
                member_type: 'Member',
                first_name: 'Test',
                last_name: 'Testerson',
                phone_number: '123-456-7890',
                occupation: 'Ephemeral Testing Entity',
                email: 'tester@testing.ts',
                birthdate: '2022-02-07',
                date_joined: '2022-02-07',
                address: '1 Test St',
                city: 'Rotester',
                state: 'NT',
                zip: '11111',
                last_modified_date: '2022-02-07',
                last_modified_by: 42,
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertMemberResponse(membershipId: number) {
    switch (membershipId) {
        case 42:
            return Promise.resolve([{ insertId: 321 }]);
        case 1452:
            throw { errno: 1452 };
        case -100:
            throw { errno: 0 };
        case -200:
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export function patchMemberResponse(id: number) {
    switch (id) {
        case 42:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 3000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case 1451:
            throw { errno: 1451 };
        case -100:
            throw { errno: 0 };
        case -200:
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}
