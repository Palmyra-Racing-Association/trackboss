import React, { useEffect, useState, useContext } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    SimpleGrid,
    Input,
    Heading,
    VStack,
    Select,
    Spinner,
    Center,
} from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { UserContext } from '../contexts/UserContext';
import { getEventTypeList } from '../controller/eventType';
import { EventType } from '../../../src/typedefs/eventType';
import { PostNewEventRequest } from '../../../src/typedefs/event';

interface CreateEventModalProps {
    // eslint-disable-next-line no-unused-vars
    createEvent: (newEvent: PostNewEventRequest) => void,
    isOpen: boolean,
    onClose: () => void,
    startDateTime: Date,
    endDateTime: Date,
}

function generateEventTypeOptions(eventTypes: EventType[]) {
    const options: any[] = [];
    for (let i = 0; i < (eventTypes).length; i++) {
        options.push(<option key={i} value={eventTypes[i].eventTypeId}>{eventTypes[i].type}</option>);
    }
    return options;
}

export default function CreateEventModal(props: CreateEventModalProps) {
    const { state } = useContext(UserContext);
    const { isOpen, onClose } = props;
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [eventTypeId, setEventTypeId] = useState(0);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [error, setError] = useState<string>('');
    const [startDateTime, setStartDateTime] = useState<Date>(props.startDateTime);
    const [endDateTime, setEndDateTime] = useState<Date>(props.endDateTime);
    const [isEventCreating, setIsEventCreating] = useState<boolean>(false);

    useEffect(() => {
        async function getData() {
            const res = await getEventTypeList(state.token);
            if ('reason' in res) {
                setError(res.reason);
            } else {
                setEventTypes(res);
            }
        }
        getData();
    }, []);
    return (
        <div>
            { error !== '' }
            <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><Heading>Create New Event</Heading></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {
                            isEventCreating ? (
                                <Center>
                                    <Spinner size="xl" color="orange.300" />
                                    Please wait while the event(s) are created...
                                </Center>
                            ) : (
                                <SimpleGrid minChildWidth="200px" spacing="40px">
                                    <VStack align="left">
                                        <Text>Event Name:</Text>
                                        <Input
                                            placeholder="Name"
                                            _placeholder={{ color: 'gray.100' }}
                                            borderColor="gray.100"
                                            onChange={(e) => setEventName(e.target.value)}
                                        />
                                    </VStack>
                                    <VStack align="left">
                                        <Text>Description:</Text>
                                        <Input
                                            placeholder="Description"
                                            _placeholder={{ color: 'gray.100' }}
                                            borderColor="gray.100"
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </VStack>
                                    <VStack align="left">
                                        <Text>Label:</Text>
                                        <Select
                                            _placeholder={{ color: 'gray.100' }}
                                            placeholder="Select Label..."
                                            onChange={(e) => { setEventTypeId(parseInt(e.target.value, 10)); }}
                                        >
                                            {generateEventTypeOptions(eventTypes)}
                                        </Select>
                                    </VStack>
                                    <VStack align="left">
                                        <Text>Start Date/Time:</Text>
                                        <DateTimePicker
                                            disableClock
                                            onChange={
                                                (date: any) => {
                                                    setStartDateTime(date);
                                                    // when the start is picked - set the end to the start. This is just
                                                    // for ease of use and picking dates.
                                                    setEndDateTime(date);
                                                }
                                            }
                                            onCalendarClose={() => setEndDateTime(startDateTime)}
                                            value={startDateTime}
                                        />
                                    </VStack>
                                    <VStack align="left">
                                        <Text>End Date/Time:</Text>
                                        <DateTimePicker
                                            disableClock
                                            minDate={startDateTime}
                                            onChange={(date: any) => setEndDateTime(date)}
                                            value={endDateTime}
                                        />
                                    </VStack>
                                </SimpleGrid>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            isDisabled={isEventCreating}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            bgColor="orange"
                            color="white"
                            isDisabled={isEventCreating}
                            onClick={
                                () => {
                                    setIsEventCreating(true);
                                    // Set the loading state to false after 3 seconds
                                    setTimeout(() => {
                                        setIsEventCreating(false);
                                        onClose();
                                    }, 2750); // Adjust time as needed
                                    const newEvent: PostNewEventRequest = {
                                        startDate: startDateTime.toISOString(),
                                        endDate: endDateTime.toISOString(),
                                        eventTypeId,
                                        eventName,
                                        eventDescription: description,
                                    };
                                    props.createEvent(newEvent);
                                }
                            }
                        >
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
