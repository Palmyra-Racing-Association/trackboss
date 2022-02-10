import React, { useEffect, useState } from 'react';
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
import { makeEvent } from '../controller/event';
import { getMockedEventTypeList } from '../controller/eventType';

function generateEventTypeOptions(eventTypes: any[]) {
    const options: any[] = [];
    for (let i = 0; i < (eventTypes).length; i++) {
        options.push(<option key={i} value={eventTypes[i].eventTypeId}>{eventTypes[i].type}</option>);
    }
    return options;
}

async function handleClose(
    eventName: string,
    eventDescription: string,
    startDateTime: Date,
    endDateTime: Date,
    eventTypeId: number,
) {
    await makeEvent(eventName, eventDescription, startDateTime, endDateTime, eventTypeId);
}

export default function CreateEventModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [eventTypeId, setEventTypeId] = useState(0);
    const [eventTypes, setEventTypes] = useState([{}]);

    useEffect(() => {
        async function getData() {
            const types = await getMockedEventTypeList();
            setEventTypes(types);
        }
        getData();
    }, []);
    return (
        <div>
            <Button background="orange.300" color="white" onClick={onOpen}>Create New Event</Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
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
                                    onChange={(date: Date) => setStartDateTime(date)}
                                    value={startDateTime}
                                />
                            </VStack>
                            <VStack align="left">
                                <Text>End Date/Time:</Text>
                                <DateTimePicker
                                    disableClock
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
                                    handleClose(eventName, description, startDateTime, endDateTime, eventTypeId);
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
>>>>>>> e9546dd474c8dc68a4748fe182cccef0fdca1b50
