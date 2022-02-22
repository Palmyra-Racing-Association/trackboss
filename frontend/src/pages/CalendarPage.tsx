/* eslint-disable */
/* eslint-disable import/no-duplicates */
import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box } from '@chakra-ui/react';
import EventCalendar from '../components/EventCalendar';
import Header from '../components/Header';
import theme from '../theme';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCalendarEventList } from '../controller/event';
import CreateEventModal from '../components/CreateEventModal';

// TODO: should we also be getting all jobs and displaying them as well?
async function getEventListLocal(): Promise<any> {
    const events = await getCalendarEventList();
    return events;
}

function CalendarPage() {
    const [upcomingEvents, setEvents] = useState([]);
    useEffect(() => {
        async function getData() {
            const events = await getEventListLocal();
            setEvents(events);
        }
        getData();
    }, []);
    return (
        <ChakraProvider theme={theme}>
            <Header title="Calendar" activeButtonId={2} />
            <Box p={5} pb={0} pl={10}>
                <CreateEventModal />
            </Box>
            <Box p={5} pt={3} pl={10} pr={10}>
                <EventCalendar events={upcomingEvents} />
            </Box>
        </ChakraProvider>
    );
}

export default CalendarPage;
