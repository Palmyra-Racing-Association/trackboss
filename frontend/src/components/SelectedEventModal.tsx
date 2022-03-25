/* eslint-disable max-len */
import React, { useContext } from 'react';
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
} from '@chakra-ui/react';
import moment from 'moment';
import { getEventMonthDaySpan, getEventStartAndEndTime } from '../controller/utils';
import { UserContext } from '../contexts/UserContext';
import { PatchJobRequest } from '../../../src/typedefs/job';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  selectedEvent: any,
  onSignUpOpen: () => void;
  admin: boolean;
  deleteEvent: () => void;
  // eslint-disable-next-line no-unused-vars
  signUpForJob: (patchInfo: { jobId: number; editedJob: PatchJobRequest; }) => void;
}

export default function SelectedEventModal(props: modalProps) {
    const { state } = useContext(UserContext);

    async function generateJobSignUpPatch() {
        let editedJob: PatchJobRequest;
        if ('jobId' in (props.selectedEvent) && state.user) {
            const { jobId } = props.selectedEvent;
            editedJob = {
                memberId: state.user.memberId,
                eventId: props.selectedEvent.eventId,
                jobTypeId: undefined,
                jobStartDate: moment(props.selectedEvent.start).toISOString(true).slice(0, -10),
                jobEndDate: moment(props.selectedEvent.end).toISOString(true).slice(0, -10),
                pointsAwarded: props.selectedEvent.pointsAwarded,
                verified: props.selectedEvent.verified,
                paid: props.selectedEvent.paid,
                modifiedBy: state.user.memberId,
            };
            return { jobId, editedJob };
        }
        return undefined;
    }

    return (
        <Modal isCentered size="lg" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                    pl={2}
                    pt={2}
                    color="orange.400"
                >
                    {getEventMonthDaySpan(props.selectedEvent.start.toString(), props.selectedEvent.end.toString())}
                </Heading>
                <ModalBody>
                    <Text fontSize="2xl" textAlign="center">
                        {props.selectedEvent.title}
                    </Text>
                    <Text fontSize="xl" textAlign="center">
                        {
                            getEventStartAndEndTime(
                                props.selectedEvent.start.toString(),
                                props.selectedEvent.end.toString(),
                            )
                        }
                    </Text>
                </ModalBody>
                {
                    'jobId' in props.selectedEvent && (
                        <SimpleGrid columns={1}>
                            <Center>
                                <HStack spacing={0}>
                                    <Text fontSize="xl">Work Points:</Text>
                                    <Text
                                        pl={2}
                                        color="orange.400"
                                        fontSize="3xl"
                                    >
                                        {props.selectedEvent.pointsAwarded}
                                    </Text>
                                </HStack>
                            </Center>
                            <Center>
                                <VStack spacing={1}>
                                    {
                                        // Don't display the family sign up button if the job already has a member
                                        props.admin && 'jobId' in props.selectedEvent && !props.selectedEvent.member && (
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
                                to={`signups/${(moment(props.selectedEvent.start).toISOString()).split('T')[0]}`}
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
                                        props.deleteEvent();
                                        props.onClose();
                                    }
                                }
                            >
                                Delete
                            </Button>
                        )
                    }
                    {
                        // Don't display the sign up button if the job already has a member
                        'jobId' in props.selectedEvent && !props.selectedEvent.member && (
                            <Button
                                bgColor="orange"
                                color="white"
                                onClick={
                                    async () => {
                                        const signUpPatch = await generateJobSignUpPatch();
                                        if (signUpPatch) {
                                            props.signUpForJob(signUpPatch);
                                        }
                                        props.onClose();
                                    }
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
