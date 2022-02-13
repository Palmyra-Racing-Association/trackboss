/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

// export function getJobListResponse(values: string[]) {
//     const memberList = [
//         {
//             member_id: 1,
//             member_type: 'Admin',
//             active: [1],
//         }, {
//             member_id: 2,
//             member_type: 'Membership Admin',
//             active: [1],
//         }, {
//             member_id: 3,
//             member_type: 'Member',
//             active: [1],
//         }, {
//             member_id: 4,
//             member_type: 'Paid Laborer',
//             active: [1],
//         },
//     ];

//     if (values.length === 0) {
//         return Promise.resolve([memberList]);
//     }
//     if (values[0] === 'ise') {
//         throw new Error('error message');
//     }

//     return Promise.resolve([memberList.filter((member) => member.member_type === values[0])]);
// }

export function getJobResponse(id: number) {
    switch (id) {
        case 18:
            return Promise.resolve([[{
                job_id: 18,
                member: 'Doctor Tester',
                event: 'The MAIN Event!',
                job_date: '2021-12-28',
                job_type: 'Gate Watcher',
                verified: [1],
                verified_date: '2022-02-07',
                points_awarded: '3',
                paid: [0],
                paid_date: null,
                last_modified_date: '2022-02-07',
                last_modified_by: 'Bob Tes',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertJobResponse(memberId: number) {
    switch (memberId) {
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

export function patchJobResponse(id: number) {
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

export function deleteJobResponse(id: number) {
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
