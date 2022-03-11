import _ from 'lodash';
import { compareAsc } from 'date-fns';
import { Event, PatchEventRequest, PostNewEventRequest } from '../../../typedefs/event';
import * as event from '../../../database/event';

export const eventList: Event[] = [
    {
        eventId: 0,
        start: '2022-07-12 9:00:00',
        end: '2022-07-14 22:00:00',
        eventType: 'race',
        title: 'Big Testing Event',
        eventDescription: 'COME ONE COME ALL',
    },
    {
        eventId: 1,
        start: '2022-08-02 9:00:00',
        end: '2022-08-04 22:00:00',
        eventType: 'race',
        title: 'Big Testing Event 2',
        eventDescription: 'TO THE BIGGEST TESTING EVENT',
    },
    {
        eventId: 2,
        start: '2022-09-26 9:00:00',
        end: '2022-09-28 22:00:00',
        eventType: 'race',
        title: 'Big Testing Event 3',
        eventDescription: 'THE WORLD HAS EVER SEEN',
    },
];

export const mockInsertEvent = jest.spyOn(event, 'insertEvent')
    .mockImplementationOnce((): Promise<number> => {
        throw new Error('internal server error');
    }).mockImplementationOnce((): Promise<number> => {
        throw new Error('user input error');
    }).mockImplementation((req: PostNewEventRequest): Promise<number> => {
        let type = '';
        switch (req.eventTypeId) {
            case 0:
                type = 'race';
                break;
            default:
                type = 'a new event';
        }
        const newEvent = {
            eventId: eventList.length,
            start: req.startDate as string,
            end: req.endDate as string,
            eventType: type as string,
            title: req.eventName as string,
            eventDescription: req.eventDescription as string,
        };
        return Promise.resolve(eventList.push(newEvent) - 1);
    });

export const mockGetEvent = jest.spyOn(event, 'getEvent')
    .mockImplementation((id: number): Promise<Event> => {
        let returnMemeber: Event[] = [];
        if (id === 400) {
            throw new Error('internal server error');
        }
        returnMemeber = _.filter(eventList, (ev: Event) => ev.eventId === id);
        if (returnMemeber.length === 0) {
            throw new Error('not found');
        }
        return Promise.resolve(returnMemeber[0]);
    });

export const mockGetEventList =
    jest.spyOn(event, 'getEventList').mockImplementationOnce((): Promise<Event[]> => {
        throw new Error('internal server error');
    }).mockImplementation((startDate?: string, endDate?: string): Promise<Event[]> => {
        let events: Event[] = eventList;
        if (typeof startDate !== 'undefined') {
            events = _.filter(events, (ev: Event) => compareAsc(new Date(ev.start), new Date(startDate)) >= 0);
        }
        if (typeof endDate !== 'undefined') {
            events = _.filter(events, (ev: Event) => compareAsc(new Date(ev.start), new Date(endDate)) <= 0);
        }
        return Promise.resolve(events);
    });

export const mockPatchEvent = jest.spyOn(event, 'patchEvent').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementationOnce(async (): Promise<void> => {
    throw new Error('user input error');
}).mockImplementation(async (eventId: number, req: PatchEventRequest): Promise<void> => {
    const filtered = _.filter(eventList, (mem: Event) => mem.eventId === eventId);
    if (filtered.length === 0) {
        throw new Error('not found');
    }
    eventList[eventId] = {
        ...eventList[eventId],
        ...req,
    };
});

export const mockDeleteEvent = jest.spyOn(event, 'deleteEvent').mockImplementationOnce(() => {
    throw new Error('internal server');
}).mockImplementation(async (eventId: number): Promise<void> => {
    const deleted = _.remove(eventList, (ev: Event) => ev.eventId === eventId);
    if (deleted.length === 0) {
        throw new Error('not found');
    }
});
