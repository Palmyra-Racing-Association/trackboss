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
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export function insertEventTypeResponse(type: string) {
    switch (type) {
        case '-100':
            throw new Error('error message');
        case 'special event':
            return Promise.resolve([{ insertId: 50 }]);
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
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}
