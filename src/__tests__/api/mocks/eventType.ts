import _ from 'lodash';
import * as eventType from '../../../database/eventType';
import { EventType, PatchEventTypeRequest, PostNewEventTypeRequest } from '../../../typedefs/eventType';

export const eventTypeList: EventType[] = [
    {
        eventTypeId: 0,
        type: 'Race',
        lastModifiedDate: '1/1/2020',
        lastModifiedBy: 'Bob',
        active: true,
    }, {
        eventTypeId: 1,
        type: 'Race Week',
        lastModifiedDate: '4/1/2020',
        lastModifiedBy: 'Joe',
        active: true,
    }, {
        eventTypeId: 2,
        type: 'XO Race',
        lastModifiedDate: '3/1/2020',
        lastModifiedBy: 'Joe',
        active: true,
    }, {
        eventTypeId: 3,
        type: 'Yearly Job',
        lastModifiedDate: '2/1/2020',
        lastModifiedBy: 'Bob',
        active: true,
    },
];

export const mockInsertEventType = jest.spyOn(eventType, 'insertEventType')
    .mockImplementationOnce((): Promise<number> => {
        throw new Error('internal server error');
    }).mockImplementationOnce((): Promise<number> => {
        throw new Error('user input error');
    }).mockImplementation((req: PostNewEventTypeRequest): Promise<number> => {
        const newEventType = {
            type: req.type as string,
            lastModifiedBy: '',
            lastModifiedDate: '2022-02-12',
            active: true,
            eventTypeId: eventTypeList.length,
        };
        return Promise.resolve(eventTypeList.push(newEventType) - 1);
    });
export const mockGetEventTypeList = jest.spyOn(eventType, 'getEventTypeList').mockImplementationOnce(() => {
    throw new Error('internal server error');
}).mockImplementation((): Promise<EventType[]> => Promise.resolve(eventTypeList));

export const mockGetEventType = jest.spyOn(eventType, 'getEventType').mockImplementation((eventTypeId: number) => {
    let returnType: EventType[] = [];
    if (eventTypeId === 400) {
        throw new Error('internal server error');
    }
    returnType = _.filter(eventTypeList, (et: EventType) => et.eventTypeId === eventTypeId);

    if (returnType.length === 0) {
        throw new Error('not found');
    }
    return Promise.resolve(returnType[0]);
});

export const mockPatchEventType = jest.spyOn(eventType, 'patchEventType').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (eventTypeId: number, req: PatchEventTypeRequest): Promise<void> => {
    const filtered = _.filter(eventTypeList, (et: EventType) => et.eventTypeId === eventTypeId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    eventTypeList[eventTypeId] = {
        ...eventTypeList[eventTypeId],
        ...req,
    };
});
