/* eslint-disable */
/* eslint-disable import/no-duplicates */
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { ChakraProvider, Box } from '@chakra-ui/react';
import EventCalendar from '../components/EventCalendar';
import Header from '../components/Header';
import theme from '../theme';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getCalendarEvents } from '../controller/event';
import { getCalendarJobs } from '../controller/job'; 
import CreateEventModal from '../components/CreateEventModal';
import { Event } from '../../../src/typedefs/event';
import { Job } from '../../../src/typedefs/job';

async function getCalendarEventsLocal(token: string) {
    const events = await getCalendarEvents(token)
    const jobs = await getCalendarJobs(token);

    const calendarEvents: Array<Job | Event> = [];
    if (events && jobs) {
        console.log(jobs[0]);
        console.log(events[0])
        calendarEvents.push(events[0]);
        calendarEvents.push(jobs[0]);
    }
    
    return calendarEvents;
}

function CalendarPage() {
    const { state } = useContext(UserContext);
    // 'any' is needed here for the calendar to render properly
    const [upcomingEvents, setEvents] = useState<any[]>();
    useEffect(() => {
        async function getData() {
            setEvents(await getCalendarEventsLocal(state.token));
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
                {
                    upcomingEvents && (
                        <EventCalendar events={upcomingEvents} />
                    )
                }
            </Box>
        </ChakraProvider>
    );
}

export default CalendarPage;
