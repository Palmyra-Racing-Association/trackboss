/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getBoardMemberListResponse(values: string[]) {
    const boardMemberList = [
        {
            board_id: 1,
            title: 'Public Relations',
            year: 2022,
            member_id: 1,
        }, {
            board_id: 2,
            title: 'Vice President',
            year: 2022,
            member_id: 2,
        }, {
            board_id: 3,
            title: 'Treasurer',
            year: 2020,
            member_id: 3,
        },
    ];
    if (values.length === 0) {
        return Promise.resolve([boardMemberList]);
    }
    if (values[0] === '-100') {
        throw new Error('error message');
    }
    return Promise.resolve([boardMemberList.filter((boardMember) => (boardMember.year === +values[0]))]);
}

export function getBoardMemberResponse(id: number) {
    switch (id) {
        case 10:
            return Promise.resolve([[{
                board_id: 10,
                title: 'Public Relations',
                year: 2022,
                member_id: 1,
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertBoardMemberResponse(year: number) {
    switch (year) {
        case 2050:
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

export function patchBoardMemberResponse(id: number) {
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

export function deleteBoardMemberResponse(id: number) {
    switch (id) {
        case 50:
            return Promise.resolve([{ affectedRows: 1 }]);
        case 5000:
            return Promise.resolve([{ affectedRows: 0 }]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}
