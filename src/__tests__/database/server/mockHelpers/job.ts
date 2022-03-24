/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getJobListResponse(values: string[]) {
    const jobList = [
        {
            job_id: 18,
            member: 'Doctor Tester',
            member_id: 50,
            membership_id: 600,
            event: 'The MAIN Event!',
            event_id: 100,
            start: '2021-12-28 07:00:00',
            end: '2021-12-28 15:00:00',
            title: 'Gate Watcher',
            verified: [1],
            verified_date: '2022-02-07',
            points_awarded: '3',
            paid: [0],
            paid_date: null,
            last_modified_date: '2022-02-07',
            last_modified_by: 'Bob Tes',
        }, {
            job_id: 19,
            member: 'Testy Testerson',
            member_id: 6,
            membership_id: 3,
            event: 'The second Event!',
            event_id: 101,
            start: '2022-12-28 06:00:00',
            end: '2022-12-28 18:00:00',
            title: 'Waterer',
            verified: [0],
            verified_date: null,
            points_awarded: null,
            paid: [0],
            paid_date: null,
            last_modified_date: '2022-02-07',
            last_modified_by: 'Bob Tes',
        }, {
            job_id: 20,
            member: null,
            member_id: null,
            membership_id: null,
            event: 'The MAIN Event!',
            event_id: 100,
            start: '2020-03-22 12:00:00',
            end: '2020-03-22 19:00:00',
            title: 'Gate Watcher',
            verified: [0],
            verified_date: null,
            points_awarded: null,
            paid: [0],
            paid_date: null,
            last_modified_date: '2022-02-07',
            last_modified_by: 'Bob Tes',
        }, {
            job_id: 21,
            member: 'Doctor Tester',
            member_id: 50,
            membership_id: 600,
            event: 'The MAIN Event!',
            event_id: 100,
            start: '2021-12-28 07:00:00',
            end: '2021-12-28 17:00:00',
            title: 'Gate Watcher',
            verified: [1],
            verified_date: '2022-02-07',
            points_awarded: '3',
            paid: [0],
            paid_date: null,
            last_modified_date: '2022-02-07',
            last_modified_by: 'Bob Tes',
        },
    ];
    if (values.length === 0) {
        return Promise.resolve([jobList]);
    }
    switch (values[0]) {
        case '-100':
            throw new Error('error message');
        case '1':
            return Promise.resolve([jobList.filter((job) => job.member)]);
        case '0':
            return Promise.resolve([jobList.filter((job) => job.member_id === null)]);
        case '2':
            return Promise.resolve([jobList.filter((job) => job.verified === [0])]);
        case '50':
            return Promise.resolve([jobList.filter((job) => job.member_id === 50)]);
        case '100':
            return Promise.resolve([jobList.filter((job) => job.event_id === 100)]);
        case '600':
            return Promise.resolve([jobList.filter((job) => job.membership_id === 600)]);
        case '200':
            return Promise.resolve([jobList.filter((job) => Date.parse(job.start) >= Date.parse(values[1]))]);
        case '201':
            return Promise.resolve([jobList.filter((job) => Date.parse(job.start) <= Date.parse(values[1]))]);
        default:
            return Promise.resolve();
    }
}

export function getJobResponse(id: number) {
    switch (id) {
        case 18:
            return Promise.resolve([[{
                job_id: 18,
                member: 'Doctor Tester',
                event: 'The MAIN Event!',
                event_id: 100,
                start: '2021-12-28 08:00:00',
                end: '2021-12-28 18:00:00',
                title: 'Gate Watcher',
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
