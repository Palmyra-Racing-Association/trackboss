/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getBoardMemberListTypeResponse() {
    const boardMemberList = [
        {
            board_title_id: 10,
            title: 'Public Relations',
        }, {
            board_title_id: 11,
            title: 'Pro Tester',
        }, {
            board_title_id: 12,
            title: 'Board of Testing',
        },
    ];
    return Promise.resolve([boardMemberList]);
}

export function getBoardMemberTypeResponse(id: number) {
    switch (id) {
        case 9:
            return Promise.resolve([[{
                board_title_id: 9,
                title: 'Public Relations',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertBoardMemberTypeResponse(title: string) {
    switch (title) {
        case 'awesome new title':
            return Promise.resolve([{ insertId: 321 }]);
        case '1452 badinput':
            throw { errno: 1452 };
        case '-100 ISE':
            throw { errno: 0 };
        case '-200 bad':
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export function patchBoardMemberTypeResponse(id: number) {
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

export function deleteBoardMemberTypeResponse(id: number) {
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
