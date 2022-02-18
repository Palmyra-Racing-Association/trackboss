/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getMemberTypeListResponse() {
    const memberTypeList = [
        {
            member_type_id: 1,
            type: 'Test Subject',
            base_dues_amt: 100,
        }, {
            member_type_id: 2,
            type: 'Test Subject',
            base_dues_amt: 100,
        }, {
            member_type_id: 3,
            type: 'Test Subject',
            base_dues_amt: 3,
        }, {
            member_type_id: 4,
            type: 'Test Subject',
            base_dues_amt: 100,
        },
    ];
    return Promise.resolve([memberTypeList]);
}

export function getMemberTypeResponse(id: number) {
    switch (id) {
        case 8:
            return Promise.resolve([[{
                member_type_id: 8,
                type: 'Test Subject',
                base_dues_amt: 100,
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw { errno: 0 };
        default:
            return Promise.resolve();
    }
}

export function patchMemberTypeResponse(id: number) {
    switch (id) {
        case 10:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 3000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case 4000:
            throw { errno: 1451 };
        case -100:
            throw { errno: 0 };
        case -200:
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}
