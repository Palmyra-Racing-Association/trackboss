import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { Calendar, DateLocalizer, Messages, momentLocalizer, View, ViewsProps } from 'react-big-calendar';
import {
    Text,
    Flex,
    Spacer,
    useDisclosure,
    Box,
} from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SelectedEventModal from './SelectedEventModal';
import SignUpModal from './SignUpModal';
import { UserContext } from '../contexts/UserContext';
import { getJobAttendees, deleteJob } from '../controller/job';
import { getFamilyMembers } from '../controller/member';
import { DeletedEvent, Event } from '../../../src/typedefs/event';
import { DeletedJob, Job } from '../../../src/typedefs/job';
import { deleteEvent } from '../controller/event';
import { ErrorResponse } from '../../../src/typedefs/errorResponse';
import CreateEventModal from './CreateEventModal';

const RenderToolbar = require('react-big-calendar/lib/Toolbar');

const localizer: DateLocalizer = momentLocalizer(moment);

interface EventCalendarProps {
    calendarEvents: Array<Job | Event>,
}

interface CustomToolbarProps {
    date: Date,
    view: View,
    views: ViewsProps<any, never>,
    label: string,
}

const customMessages: Messages = {
    next: 'Next',
    previous: 'Previous',
    today: 'Today',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    agenda: 'Agenda',
};

async function getSelectedJobAttendees(): Promise<any> {
    const attendees = await getJobAttendees();
    return attendees;
}

async function getCurrentFamilyMembers(): Promise<any> {
    const currentFamilyMembers = await getFamilyMembers();
    return currentFamilyMembers;
}

export default function EventCalendar(props: EventCalendarProps) {
    const { state } = useContext(UserContext);
    const { onClose: onViewEventClose, isOpen: isViewEventOpen, onOpen: onViewEventOpen } = useDisclosure();
    const { onClose: onSignUpClose, isOpen: isSignUpOpen, onOpen: onSignUpOpen } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<Job | Event>();
    const [eventAttendees, setAttendees] = useState<any>();
    const [familyMembers, setFamilyMembers] = useState<any>();
    const [calendarEvents, setCalendarEvents] = useState<Array<Job | Event>>([]);

    function isEvent(calendarEvent: Event | Job): calendarEvent is Event {
        if ((calendarEvent as Event).eventType) {
            return true;
        }
        // else, its a Job
        return false;
    }

    function deleteEventWasSuccessful(calendarEvent: DeletedEvent | ErrorResponse): calendarEvent is DeletedEvent {
        if ((calendarEvent as DeletedEvent).eventId) {
            return true;
        }
        // else, its an error
        return false;
    }

    function deleteJobWasSuccessfull(calendarEvent: DeletedJob | ErrorResponse): calendarEvent is DeletedJob {
        if ((calendarEvent as DeletedJob).jobId) {
            return true;
        }
        // else, its an error
        return false;
    }

    async function deleteEventLocal() {
        if (selectedEvent && isEvent(selectedEvent)) {
            const response = await deleteEvent(state.token, selectedEvent.eventId);
            if (deleteEventWasSuccessful(response)) {
                const newCalendarEvents = calendarEvents.filter((e: any) => e.eventType !== selectedEvent?.eventType);
                setCalendarEvents(newCalendarEvents);
            } else {
                // eslint-disable-next-line no-console
                console.log(response.reason);
            }
        } else if (selectedEvent) {
            const response = await deleteJob(state.token, selectedEvent.jobId);
            if (deleteJobWasSuccessfull(response)) {
                const newCalendarEvents = calendarEvents.filter((e: any) => e.jobId !== selectedEvent?.jobId);
                setCalendarEvents(newCalendarEvents);
            } else {
                // eslint-disable-next-line no-console
                console.log(response.reason);
            }
        }
    }
    useEffect(() => {
        async function getData() {
            const attendees = await getSelectedJobAttendees();
            const currentFamilyMembers = await getCurrentFamilyMembers();
            setAttendees(attendees);
            setFamilyMembers(currentFamilyMembers);
            setCalendarEvents(props.calendarEvents);
        }
        getData();
    }, []);

    return (
        <div>
            <Box pt={5} pb={5}>
                <CreateEventModal />
            </Box>
            <Calendar
                defaultView="month"
                events={calendarEvents}
                selected={selectedEvent}
                onSelectEvent={
                    (calendarEvent) => {
                        setSelectedEvent(calendarEvent);
                        onViewEventOpen();
                    }
                }
                localizer={localizer}
                eventPropGetter={
                    (calendarEvent) => {
                        const newStyle = {
                            backgroundColor: 'lightgrey',
                            color: 'black',
                        };
                        if (isEvent(calendarEvent)) {
                            if (calendarEvent.eventType === 'Meeting') {
                                newStyle.backgroundColor = '#76CE6F';
                            } else if (
                                calendarEvent.eventType === 'Yearly Job' ||
                                calendarEvent.eventType === 'Work Day') {
                                newStyle.backgroundColor = '#68A9FF';
                            } else if (
                                calendarEvent.eventType === 'Race' ||
                                calendarEvent.eventType === 'Race Week' ||
                                calendarEvent.eventType === 'XO Race' ||
                                calendarEvent.eventType === 'Harescramble') {
                                newStyle.backgroundColor = '#EE6439';
                            } else if (
                                calendarEvent.eventType === 'Camp and Ride' ||
                                calendarEvent.eventType === 'Ride Day') {
                                newStyle.backgroundColor = 'lightgrey';
                            } else { // its a Job
                                newStyle.backgroundColor = '#68A4FF';
                            }
                            return {
                                style: newStyle,
                            };
                        }
                        // unreachable
                        return {};
                    }
                }
                style={{ height: '70vh' }}
                components={
                    {
                        toolbar: React.memo((toolbarProps: CustomToolbarProps, children) => (
                            <RenderToolbar
                                // Necessary for the custom toolbar to render properly
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...toolbarProps}
                                localizer={
                                    {
                                        messages: {
                                            ...customMessages,
                                        },
                                    }
                                }
                                label={
                                    (
                                        <Flex pl={20}>
                                            <Spacer />
                                            <Text
                                                fontFamily="sans-serif"
                                                fontWeight={30}
                                                fontSize="3xl"
                                            >
                                                {toolbarProps.label}
                                            </Text>
                                            <Spacer />
                                        </Flex>
                                    )
                                }
                            >
                                {children}
                            </RenderToolbar>
                        )),
                    }
                }
            />
            {
                selectedEvent && (
                    <SelectedEventModal
                        isOpen={isViewEventOpen}
                        onClose={onViewEventClose}
                        selectedEvent={selectedEvent}
                        onSignUpOpen={onSignUpOpen}
                        admin={state.user?.memberType === 'Admin'}
                        // eslint-disable-next-line react/jsx-no-bind
                        deleteEvent={deleteEventLocal}
                        // signUpForEvent={signUpForEvent}
                    />
                )
            }
            {
                familyMembers && eventAttendees && (
                    <SignUpModal
                        isOpen={isSignUpOpen}
                        onClose={onSignUpClose}
                        attendeesList={eventAttendees}
                        familyMembers={familyMembers}
                    />
                )
            }
        </div>
    );
}
