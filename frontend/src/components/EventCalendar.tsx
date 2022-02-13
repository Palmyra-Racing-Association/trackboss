import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Calendar, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import {
    Text,
    Flex,
    Spacer,
    useDisclosure,
} from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SelectedEventModal from './SelectedEventModal';
import SignUpModal from './SignUpModal';
import { getJobAttendees } from '../controller/job';
import { getFamilyMembers } from '../controller/member';
// import Event from '../../../src/typedefs/event';

const Toolbar = require('react-big-calendar/lib/Toolbar');

interface EventCalendarProps {
    // This <any> will be replaced with our own Event Typedef, once it has all the attributes we need here
    // events: Event[],
    events: any[],
}

const localizer: DateLocalizer = momentLocalizer(moment);

async function getSelectedJobAttendees(): Promise<any> {
    const attendees = await getJobAttendees();
    return attendees;
}

async function getCurrentFamilyMembers(): Promise<any> {
    const currentFamilyMembers = await getFamilyMembers();
    return currentFamilyMembers;
}

function EventCalendar(props: EventCalendarProps) {
    const { onClose: onViewEventClose, isOpen: isViewEventOpen, onOpen: onViewEventOpen } = useDisclosure();
    const { onClose: onSignUpClose, isOpen: isSignUpOpen, onOpen: onSignUpOpen } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<any>();
    const [eventAttendees, setAttendees] = useState<any>();
    const [familyMembers, setFamilyMembers] = useState<any>();

    useEffect(() => {
        async function getData() {
            const attendees = await getSelectedJobAttendees();
            const currentFamilyMembers = await getCurrentFamilyMembers();
            setAttendees(attendees);
            setFamilyMembers(currentFamilyMembers);
        }
        getData();
    }, []);

    return (
        <div>
            <Calendar
                defaultView="month"
                events={props.events}
                selected={selectedEvent}
                onSelectEvent={
                    (event) => {
                        setSelectedEvent(event);
                        onViewEventOpen();
                    }
                }
                localizer={localizer}
                eventPropGetter={
                    (event) => {
                        const newStyle = {
                            backgroundColor: 'lightgrey',
                            color: 'black',
                        };
                        if (event.type === 'meeting') {
                            newStyle.backgroundColor = '#76CE6F';
                        } else if (event.type === 'job') {
                            newStyle.backgroundColor = '#68A4FF';
                        } else if (event.type === 'race') {
                            newStyle.backgroundColor = '#EE6439';
                        } else {
                            newStyle.backgroundColor = 'lightgrey';
                        }
                        return {
                            style: newStyle,
                        };
                    }
                }
                style={{ height: '70vh' }}
                components={
                    {
                    // eslint-disable-next-line no-shadow
                        toolbar: ({ localizer, ...props }, children) => (
                            <Toolbar
                            // eslint-disable-next-line react/jsx-props-no-spreading
                                {...props}
                                localizer={
                                    {
                                        messages: {
                                            ...localizer.messages,
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
                                                {/* eslint-disable-next-line react/prop-types */}
                                                {props.label}
                                            </Text>
                                            <Spacer />
                                        </Flex>
                                    )
                                }
                            >
                                {children}
                            </Toolbar>
                        ),
                    }
                }
            />
            {
                selectedEvent && eventAttendees && (
                    <SelectedEventModal
                        isOpen={isViewEventOpen}
                        onClose={onViewEventClose}
                        selectedEvent={selectedEvent}
                        onSignUpOpen={onSignUpOpen}
                        attendeesList={eventAttendees}
                        admin
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

export default EventCalendar;
