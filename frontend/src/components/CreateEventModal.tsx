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
    useDisclosure,
    Text,
    SimpleGrid,
    Input,
    Heading,
    VStack,
    Select,
} from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import { UserContext } from '../contexts/UserContext';
import { getEventTypeList } from '../controller/eventType';
import { EventType } from '../../../src/typedefs/eventType';
import { PostNewEventRequest } from '../../../src/typedefs/event';

interface CreateEventModalProps {
    // eslint-disable-next-line no-unused-vars
    createEvent: (newEvent: PostNewEventRequest) => void,
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [eventTypeId, setEventTypeId] = useState(0);
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [error, setError] = useState<string>('');

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
            <Button background="orange.300" color="white" onClick={onOpen}>Create New Event</Button>
            { error !== '' }
            <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><Heading>Create New Event</Heading></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
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
                                        (date: Date) => {
                                            setStartDateTime(date);
                                            // when the start is picked - set the end to the start.  This is just
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
                                    onChange={(date:Date) => setEndDateTime(date)}
                                    value={endDateTime}
                                />
                            </VStack>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            variant="ghost"
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button
                            bgColor="orange"
                            color="white"
                            onClick={
                                () => {
                                    const newEvent: PostNewEventRequest = {
                                        startDate: startDateTime.toISOString(),
                                        endDate: endDateTime.toISOString(),
                                        eventTypeId,
                                        eventName,
                                        eventDescription: description,
                                    };
                                    props.createEvent(newEvent);
                                    onClose();
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
