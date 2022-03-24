/* eslint-disable no-await-in-loop */
// This rule assumes I'm trying to do multiple async tasks at once, meaning
// awaits in a loop would be inefficient. I do not want to do that here - I just
// want to poll insertedEventIdRead, and I want to wait a bit between each
// poll.

/* eslint-disable no-throw-literal */
// ESLint doesn't like `throw { errno: # }` since it's not throwing an error, but for a
// mock, that is sufficient because we only care about 'errno' and it's easier than
// instantiating an implementor of NodeJS.ErrnoException to get that field

import { Mutex } from 'async-mutex';
// eslint-disable-next-line import/no-unresolved
import { setTimeout } from 'timers/promises';

const insertedEventIdReadMutex = new Mutex();
let insertedEventId: number;
let insertedEventIdRead = true;

export function getEventListResponse(values: string[]) {
    const eventList = [
        {
            event_id: 10,
            start: '2000-01-01T08:00:00',
            end: '2000-01-02T08:00:00',
            event_type_id: 2,
            title: 'Test',
            event_description: 'test desc',
        }, {
            event_id: 11,
            start: '2001-01-01T08:00:00',
            end: '2001-01-02T08:00:00',
            event_type_id: 6,
            title: 'Testville',
            event_description: 'foobar',
        }, {
            event_id: 12,
            start: '2005-10-01T08:00:00',
            end: '2005-10-02T08:00:00',
            event_type_id: 4,
            title: 'Testerson',
            event_description: 'test description',
        },
    ];
    if (values.length === 0) {
        return Promise.resolve([eventList]);
    }
    if (values[0] === '-100') {
        throw new Error('error message');
    }
    return Promise.resolve([eventList.filter((event) => (event.start > values[0]) && (event.start < values[1]))]);
}

export function getEventResponse(id: number) {
    switch (id) {
        case 10:
            return Promise.resolve([[{
                event_id: 10,
                start: '2001-01-01T08:00:00',
                end: '2001-01-02T08:00:00',
                event_type: 'THE test event',
                title: 'Test',
                event_description: 'test desc',
            }]]);
        case 765:
            return Promise.resolve([[]]);
        case -100:
            throw new Error('error message');
        default:
            return Promise.resolve();
    }
}

export async function insertEventResponse(eventName: string) {
    switch (eventName) {
        case 'test event': {
            let release = await insertedEventIdReadMutex.acquire();
            try {
                while (!insertedEventIdRead) {
                    release();
                    await setTimeout(500);
                    release = await insertedEventIdReadMutex.acquire();
                }
                insertedEventId = 321;
                insertedEventIdRead = false;
            } finally {
                release();
            }
            return Promise.resolve();
        }
        case '1452':
            throw { errno: 1452 };
        case '-100':
            throw { errno: 0 };
        case '-101': {
            let release = await insertedEventIdReadMutex.acquire();
            try {
                while (!insertedEventIdRead) {
                    release();
                    await setTimeout(500);
                    release = await insertedEventIdReadMutex.acquire();
                }
                insertedEventId = -101;
                insertedEventIdRead = false;
            } finally {
                release();
            }
            return Promise.resolve();
        }
        case '-200':
            throw new Error('this error should not happen');
        default:
            return Promise.resolve();
    }
}

export async function getInsertedEventIdResponse() {
    let release = await insertedEventIdReadMutex.acquire();
    try {
        while (insertedEventIdRead) {
            release();
            await setTimeout(500);
            release = await insertedEventIdReadMutex.acquire();
        }
        if (insertedEventId === -101) {
            throw new Error('internal server error');
        }
        return Promise.resolve([[{ '@event_id': insertedEventId }]]);
    } finally {
        insertedEventIdRead = true;
        release();
    }
}

export function patchEventResponse(id: number) {
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

export function deleteEventResponse(id: number) {
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
