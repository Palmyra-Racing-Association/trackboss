/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

export function getEventJobResponse(id: number) {
    switch (id) {
        case 8:
            return Promise.resolve([[{
                event_job_id: 8,
                event_type: 'Testing Day',
                job_type: 'Test Subject',
                count: 42,
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw { errno: 0 };
        default:
            return Promise.resolve();
    }
}

export function insertEventJobResponse(eventTypeId: number) {
    switch (eventTypeId) {
        case 1:
            return Promise.resolve([{ insertId: 50 }]);
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

export function patchEventJobResponse(id: number) {
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

export function deleteEventJobResponse(id: number) {
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
