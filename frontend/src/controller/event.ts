import { generateHeaders, getEventMonthDay } from './utils';
// import { getTodaysDate } from './utils';
import {
    DeleteEventResponse,
    GetEventListResponse,
    GetEventResponse,
    PatchEventRequest,
    PatchEventResponse,
    PostNewEventRequest,
    PostNewEventResponse,
} from '../../../src/typedefs/event';

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
            mode: 'no-cors',
            headers: generateHeaders(token),
        });
        return response.json();
    }
    // else
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/event/list`, {
        method: 'GET',
        mode: 'no-cors',
        headers: generateHeaders(token),
    });
    return response.json();
}

// TODO: this is a mocked response for frontend development, replace once API is completed
export async function getUpcomingEventData() {
    // const todayString = getTodaysDate();
    // const upcomingEvents: GetEventListResponse = await getEventList('TestToken', todayString);
    // if ('reason' in upcomingEvents) {
    //     console.log('TODO: error handling?');
    // } else {
    //     return upcomingEvents[0];
    // }

    const upcomingEvents = [
        {
            eventId: 0,
            date: '2022-02-07',
            eventType: 'string',
            eventName: 'Work Day',
            eventDescription: 'string',
        },
        {
            eventId: 1,
            date: '2022-02-07',
            eventType: 'string',
            eventName: 'string',
            eventDescription: 'string',
        },
    ];
    const formattedEventDate = getEventMonthDay(upcomingEvents[0].date);
    upcomingEvents[0].date = formattedEventDate;
    return upcomingEvents[0]; // Assuming that the API will return the list sorted by date
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
