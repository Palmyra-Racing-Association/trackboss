
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
            <Box p={5} pb={0}>
                <CreateEventModal />
            </Box>
            <Box p={5} pt={20}>
                <EventCalendar events={upcomingEvents} />
            </Box>
        </ChakraProvider>
    );
}

export default CalendarPage;
