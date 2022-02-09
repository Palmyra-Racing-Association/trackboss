export function getEventTypeResponse(id: number) {
    switch (id) {
        case 8:
            return Promise.resolve([[{
                event_type_id: 8,
                type: 'Camp and Ride',
                last_modified_date: '1/1/2020',
                last_modified_by: 2,
                active: [1]
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw { errno: 0 };
        default:
            return Promise.resolve();
    }
}

export function insertEventTypeResponse(type: string) {
    switch (type) {
        case 'special event':
            return Promise.resolve([{ insertId: 50 }]);
        case '-100':
            throw { errno: 0 };
        case 'user erro':
            throw { errno: 1452 };
        case '-200':
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export function patchEventTypeResponse(id: number) {
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
