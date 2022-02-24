import React from 'react';
import { Link } from 'react-router-dom';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Button,
    Center,
    Divider,
    Heading,
    ModalBody,
    ModalFooter,
    SimpleGrid,
    HStack,
    VStack,
    Text,
    // ListItem,
    // UnorderedList,
} from '@chakra-ui/react';
import { getEventMonthDaySpan, getEventStartAndEndTime } from '../controller/utils';
// import { deleteJob } from '../controller/job';
// import { deleteEvent } from '../controller/event';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  selectedEvent: any,
  onSignUpOpen: () => void;
  // attendeesList: any[], // TODO this should match our typing
  admin: boolean
}

async function handleSignUp(selectedJob: any) {
    // eslint-disable-next-line no-console
    console.log(selectedJob);
}

async function deleteEventLocal(event: any) {
    // if (event.type === 'work') {
    //     await deleteJob('TestingToken', event);
    // } else {
    //     await deleteEvent('TestingToken', event);
    // }
    // eslint-disable-next-line no-console
    console.log(event);
    // Update state?
}

export default function SelectedEventModal(props: modalProps) {
    return (
        <Modal size="lg" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                    pl={2}
                    pt={2}
                    color="orange.400"
                >
                    {getEventMonthDaySpan(props.selectedEvent.start, props.selectedEvent.end)}
                </Heading>
                <ModalBody>
                    <Text fontSize="2xl" textAlign="center">
                        {props.selectedEvent.title}
                    </Text>
                    <Text fontSize="xl" textAlign="center">
                        {getEventStartAndEndTime(props.selectedEvent.start, props.selectedEvent.end)}
                    </Text>
                </ModalBody>
                {
                    props.selectedEvent.workPoints && (
                        <SimpleGrid columns={1}>
                            <Center>
                                <HStack spacing={0}>
                                    <Text fontSize="xl">Work Points:</Text>
                                    <Text pl={2} color="orange.400" fontSize="3xl">3</Text>
                                </HStack>
                            </Center>
                            <Center>
                                <VStack spacing={1}>
                                    {/* <Text pr={8} fontSize="xl">Going:</Text> */}
                                    {/* <Divider /> */}
                                    {/* TODO: Should we handle a case with many attendees? (10+) */}
                                    {/* <UnorderedList>
                                        {
                                            props.attendeesList.map((attendee) => (
                                                <ListItem>{attendee.name}</ListItem>
                                            ))
                                        }
                                    </UnorderedList> */}
                                    {
                                        props.admin && (
                                            <Button
                                                as="u"
                                                color="orange.300"
                                                textStyle="underline"
                                                variant="ghost"
                                                size="sm"
                                                onClick={
                                                    () => [
                                                        props.onClose(),
                                                        props.onSignUpOpen(),
                                                    ]
                                                }
                                            >
                                                Family Sign Ups
                                            </Button>
                                        )
                                    }
                                </VStack>
                            </Center>
                        </SimpleGrid>
                    )
                }
                <Divider />
                <ModalCloseButton />
                <ModalFooter>
                    {
                        props.admin && (
                            <Link
                                to={`signups/${(props.selectedEvent.start).toISOString().split('T')[0]}`}
                                state={{ date: props.selectedEvent.start }}
                            >
                                View Sign Ups
                            </Link>
                        )
                    }
                    {
                        props.admin && (
                            <Button
                                mr={3}
                                size="sm"
                                variant="ghost"
                                color="red"
                                onClick={
                                    () => {
                                        deleteEventLocal(props.selectedEvent);
                                        props.onClose();
                                    }
                                }
                            >
                                Delete
                            </Button>
                        )
                    }
                    {
                        props.selectedEvent.type === 'job' && (
                            <Button
                                bgColor="orange"
                                color="white"
                                onClick={
                                    () => [
                                        handleSignUp(props.selectedEvent),
                                        props.onClose(),
                                    ]
                                }
                            >
                                Sign Up
                            </Button>
                        )
                    }
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
