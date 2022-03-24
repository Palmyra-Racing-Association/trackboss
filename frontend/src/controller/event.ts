import { generateHeaders, getEventMonthDay, getTimeOfDay } from './utils';
import {
    DeleteEventResponse,
    GetEventListResponse,
    GetEventResponse,
    PatchEventRequest,
    PatchEventResponse,
    PostNewEventRequest,
    PostNewEventResponse,
    Event,
} from '../../../src/typedefs/event';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';

function isEventList(res: Event[] | ErrorResponse): res is Event[] {
    return (res as Event[]) !== undefined;
}

export async function createEvent(token: string, eventData: PostNewEventRequest): Promise<PostNewEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/new`, {
        method: 'POST',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventData),
    });
    return response.json();
}

// TODO: this is a mocked response for frontend development, replace once API is complete
export async function makeEvent(name: string, description: string, start: Date, end: Date, typeId: number) {
    // eslint-disable-next-line no-console
    console.debug({
        date: start,
        eventTypeId: typeId,
        eventName: name,
        eventDescription: description,
    });
}

// TODO: this is a mocked response for frontend development, replace once API is completed
export async function getCalendarEventList() {
    // const upcomingEvents: GetEventListResponse = await getEventList('TestToken', todayString);
    // if ('reason' in upcomingEvents) {
    //     console.log('TODO: error handling?');
    // } else {
    //     convertEventsToCalendarFormat(upcomingEvents);
    //     return upcomingEvents;
    // }
    const upcomingEvents = [
        {
            title: 'Work Day',
            start: new Date('2022-02-08T12:00:00'),
            end: new Date('2022-02-09T15:50:00'),
            workPoints: 3,
            type: 'job',
        },
        {
            title: 'Race Day',
            start: new Date('2022-02-11T03:10:00'),
            end: new Date('2022-02-12T14:10:00'),
            type: 'race',
        },
        {
            title: 'Work Day',
            start: new Date('2022-02-11T03:10:00'),
            end: new Date('2022-02-12T14:10:00'),
            workPoints: 3,
            type: 'job',
        },
        {
            title: 'Work Day',
            start: new Date('2022-02-11T03:10:00'),
            end: new Date('2022-02-12T14:10:00'),
            workPoints: 3,
            type: 'job',
        },
        {
            title: 'Work Day',
            start: new Date('2022-02-11T03:10:00'),
            end: new Date('2022-02-12T14:10:00'),
            workPoints: 3,
            type: 'job',
        },
        {
            title: 'Meeting',
            start: new Date('2022-02-22T15:30:00'),
            end: new Date('2022-02-22T12:00:00'),
            type: 'meeting',
        },
        {
            title: 'Some other category',
            start: new Date('2022-02-22T00:10:00'),
            end: new Date('2022-02-23T00:10:00'),
            type: 'other',
        },
    ];

    return upcomingEvents;
}

export async function getEventList(token: string, listType?: string): Promise<GetEventListResponse> {
    if (listType) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
            method: 'GET',
            mode: 'cors',
            headers: generateHeaders(token, listType),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
        method: 'GET',
        mode: 'cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function getEventCardProps(token: string, listType: string) {
    const upcomingEvents = await getEventList(token, listType);

    if (isEventList(upcomingEvents)) {
        // + symbol here converts the dates to numbers, to allow for arithmetic comparison
        upcomingEvents.sort((e1: Event, e2: Event) => +new Date(e1.start) - +new Date(e2.start));
        const formattedEventDate = getEventMonthDay(upcomingEvents[0].start);
        const formattedEventTime = getTimeOfDay(upcomingEvents[0].start);
        return { title: upcomingEvents[0].title, start: formattedEventDate, time: formattedEventTime };
    }

    // else
    return undefined;
}

export async function getEvent(token: string, eventID: number): Promise<GetEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

export async function updateEvent(
    token: string,
    eventID: number,
    eventData: PatchEventRequest,
): Promise<PatchEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: generateHeaders(token),
        body: JSON.stringify(eventData),
    });
    return response.json();
}

export async function deleteEvent(token: string, eventID: number): Promise<DeleteEventResponse> {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/${eventID}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}
