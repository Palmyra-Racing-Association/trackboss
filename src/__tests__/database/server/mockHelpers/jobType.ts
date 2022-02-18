/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getJobTypeListResponse() {
    const jobTypeList = [
        {
            job_type_id: 1,
            title: 'Test Subject',
            point_value: 3,
            cash_value: 5.50,
            job_day_number: 1,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 1,
            active: true,
            last_modified_date: '2022-02-17',
            last_modified_by: 'Testy Testerton',
        }, {
            job_type_id: 2,
            title: 'Test Subject',
            point_value: 3,
            cash_value: 5.50,
            job_day_number: 1,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 1,
            active: true,
            last_modified_date: '2022-02-17',
            last_modified_by: 'Testy Testerton',
        }, {
            job_type_id: 3,
            title: 'Test Subject',
            point_value: 3,
            cash_value: 5.50,
            job_day_number: 1,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 1,
            active: true,
            last_modified_date: '2022-02-17',
            last_modified_by: 'Testy Testerton',
        }, {
            job_type_id: 4,
            title: 'Test Subject',
            point_value: 3,
            cash_value: 5.50,
            job_day_number: 1,
            reserved: true,
            online: true,
            meal_ticket: true,
            sort_order: 1,
            active: true,
            last_modified_date: '2022-02-17',
            last_modified_by: 'Testy Testerton',
        },
    ];
    return Promise.resolve([jobTypeList]);
}

export function getJobTypeResponse(id: number) {
    switch (id) {
        case 8:
            return Promise.resolve([[{
                job_type_id: 8,
                title: 'Test Subject',
                point_value: 3,
                cash_value: 5.50,
                job_day_number: 1,
                reserved: true,
                online: true,
                meal_ticket: true,
                sort_order: 1,
                active: true,
                last_modified_date: '2022-02-17',
                last_modified_by: 'Testy Testerton',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw { errno: 0 };
        default:
            return Promise.resolve();
    }
}

export function insertJobTypeResponse(type: string) {
    switch (type) {
        case 'special job':
            return Promise.resolve([{ insertId: 50 }]);
        case '-100':
            throw { errno: 0 };
        case 'user error':
            throw { errno: 1452 };
        case '-200':
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export function patchJobTypeResponse(id: number) {
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
