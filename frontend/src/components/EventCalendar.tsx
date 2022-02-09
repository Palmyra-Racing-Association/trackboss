/* eslint-disable import/no-duplicates */
import React from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface EventCalendarProps {
    events: Event[],
}

// The types here are `object`. Strongly consider making them better as removing `locales` caused a fatal error
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales: { 'en-US': enUS },
});

function EventCalendar(props: EventCalendarProps) {
    return (
        <Calendar
            defaultView="month"
            events={props.events}
            onSelectEvent={(event) => console.log(event)}
            localizer={localizer}
            style={{ height: '80vh' }}
        />
    );
}

export default EventCalendar;
