import moment from 'moment';

/* eslint-disable radix */
export function generateHeaders(token: string, range?: string): Headers {
    if (typeof range === 'undefined') {
        return new Headers({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }
    return new Headers({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        Range: `${range}`,
    });
}

// Creates a string with today's date in YYYYMMDD format
export function getTodaysDate() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const yyyy = today.getFullYear();

    const todayString = `${yyyy}${mm}${dd}`;
    return todayString;
}

export function getEventMonthDay(date: string) {
    const dateMoment = moment(date);
    return dateMoment.format('dddd MMMM DD');
}

function singleDayEvent(start: string, end: string) {
    const startString = new Date(start);
    const endString = new Date(end);

    return startString.getDate() === endString.getDate() &&
    startString.getMonth() === endString.getMonth();
}

export function getEventMonthDaySpan(start: string, end: string) {
    const startString = new Date(start).toString();
    const startStringArray = startString.split(' ');

    const endString = new Date(end).toString();
    const endStringArray = endString.split(' ');

    const formattedStartDate = `${startStringArray[2]} ${startStringArray[1]}`;
    const formattedEndDate = `${endStringArray[2]} ${endStringArray[1]}`;

    // if the event starts and ends on the same day, only return tgetEventMonthDayhat date
    if (singleDayEvent(start, end)) {
        return formattedStartDate;
    }
    // else: return a span
    return `${formattedStartDate} - ${formattedEndDate}`;
}

export function getEventStartAndEndTime(start: string, end: string) {
    if (!singleDayEvent(start, end)) {
        return ' ';
    }
    // only show start and end times for events that happen in one day
    const startString = new Date(start).toString();
    const startStringArray = startString.split(' ');
    let startHour = parseInt(startStringArray[4].substring(0, 2));
    const startMinute = startStringArray[4].substring(3, 5);

    // gets am or pm, and converts from military to standard hours
    const startAmOrPm = startHour >= 12 ? 'PM' : 'AM'; startHour = ((startHour + 11) % 12 + 1);

    const endString = new Date(end).toString();
    const endStringArray = endString.split(' ');
    let endHour = parseInt(endStringArray[4].substring(0, 2));
    const endMinute = endStringArray[4].substring(3, 5);
    // gets am or pm, and converts from military to standard hours
    const endAmOrPm = endHour >= 12 ? 'PM' : 'AM'; endHour = ((endHour + 11) % 12 + 1);

    const response = `${startHour}:${startMinute} ${startAmOrPm} - ${endHour}:${endMinute} ${endAmOrPm}`;
    if (response === '12:00 AM - 12:00 AM') {
        return 'All Day';
    }
    return response;
}

export function getTimeOfDay(time: string) {
    const dateMoment = moment(time);
    return dateMoment.format('h a');
}
