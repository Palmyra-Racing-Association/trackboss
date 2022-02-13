import React from 'react';
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
    ListItem,
    UnorderedList,

} from '@chakra-ui/react';
import { getEventMonthDaySpan, getEventStartAndEndTime } from '../controller/utils';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  selectedJob: any,
  onSignUpOpen: () => void;
  attendeesList: any[], // TODO this should match our typing
  admin: boolean
}

async function handleSignUp(selectedJob: any) {
    // eslint-disable-next-line no-console
    console.log(selectedJob);
}

export default function SelectedEventModal(props: modalProps) {
    if (props.selectedJob && props.attendeesList) {
        return (
            <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
                <ModalOverlay />
                <ModalContent>
                    <Heading
                        textAlign="center"
                        pl={2}
                        pt={2}
                        color="orange.400"
                    >
                        {getEventMonthDaySpan(props.selectedJob.start, props.selectedJob.end)}
                    </Heading>
                    <ModalBody>
                        <Text fontSize="2xl" textAlign="center">
                            {props.selectedJob.title}
                        </Text>
                        <Text fontSize="xl" textAlign="center">
                            {getEventStartAndEndTime(props.selectedJob.start, props.selectedJob.end)}
                        </Text>
                    </ModalBody>
                    {
                        props.selectedJob.workPoints && (
                            <SimpleGrid columns={2}>
                                <Center>
                                    <VStack spacing={1}>
                                        <Text pr={8} fontSize="xl">Going:</Text>
                                        <Divider />
                                        {/* TODO: Should we handle a case with many attendees? (10+) */}
                                        <UnorderedList>
                                            {
                                                props.attendeesList.map((attendee) => (
                                                    <ListItem>{attendee.name}</ListItem>
                                                ))
                                            }
                                        </UnorderedList>
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
                                <Center>
                                    <HStack spacing={0}>
                                        <Text fontSize="xl">Work Points:</Text>
                                        <Text pl={2} color="orange.400" fontSize="3xl">3</Text>
                                    </HStack>
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
                                    props.onClose();
                                }
                            }
                        >
                            Close
                        </Button>
                        {
                            props.selectedJob.type === 'job' && (
                                <Button
                                    bgColor="orange"
                                    color="white"
                                    onClick={
                                        () => [
                                            handleSignUp(props.selectedJob),
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
    return <div />;
}
