/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useState } from 'react';
import moment from 'moment';
import { Calendar, DateLocalizer, momentLocalizer } from 'react-big-calendar';
import {
    Text,
    Flex,
    Spacer,
    useDisclosure,
    Button, Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    Divider,
    ModalOverlay,
    SimpleGrid,
    Center,
    VStack,
} from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEventStartAndEndTime, getEventMonthDaySpan } from '../controller/utils';
// import Event from '../../../src/typedefs/event';

const Toolbar = require('react-big-calendar/lib/Toolbar');

interface EventCalendarProps {
    // This <any> will be replaced with our own Event Typedef, once it has all the attributes we need here
    // events: Event[],
    events: any[],
}

const localizer: DateLocalizer = momentLocalizer(moment);

function eventInfoModal(admin: boolean, selectedEvent: any, onClose: () => void) {
    if (selectedEvent) {
        return (
            <div>
                <ModalContent>
                    <Heading
                        textAlign="center"
                        pl={2}
                        pt={2}
                        color="orange.400"
                    >
                        {getEventMonthDaySpan(selectedEvent.start, selectedEvent.end)}
                    </Heading>
                    <ModalBody>
                        <Text fontSize="2xl" textAlign="center">
                            {selectedEvent.title}
                        </Text>
                        <Text fontSize="xl" textAlign="center">
                            {getEventStartAndEndTime(selectedEvent.start, selectedEvent.end)}
                        </Text>
                    </ModalBody>
                    {
                        selectedEvent.workPoints && (
                            <SimpleGrid columns={2}>
                                <Center>
                                    <Text>Test</Text>
                                </Center>
                                <Center>
                                    <VStack spacing={0}>
                                        <Text fontSize="xl">Work Points</Text>
                                        <Text color="orange.400" fontSize="3xl">3</Text>
                                    </VStack>
                                </Center>
                            </SimpleGrid>
                        )
                    }
                    <Divider />
                    <ModalCloseButton />
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            size="sm"
                            onClick={
                                () => {
                                    onClose();
                                }
                            }
                        >
                            Close
                        </Button>
                        {
                            selectedEvent.type === 'job' && (
                                <Button
                                    bgColor="orange"
                                    color="white"
                                    onClick={
                                        () => {
                                            // handleSignUp();
                                            onClose();
                                        }
                                    }
                                >
                                    Create
                                </Button>
                            )
                        }

                    </ModalFooter>
                </ModalContent>
            </div>
        );
    }
    return <div />;
}
function EventCalendar(props: EventCalendarProps) {
    const { onClose, isOpen, onOpen } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<any>();

    return (
        <div>
            <Calendar
                defaultView="month"
                events={props.events}
                selected={selectedEvent}
                onSelectEvent={
                    (event) => {
                        setSelectedEvent(event as any);
                        onOpen();
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
            <Modal size="md" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                { eventInfoModal(true, selectedEvent, onClose) }
            </Modal>
        </div>
    );
}

export default EventCalendar;
