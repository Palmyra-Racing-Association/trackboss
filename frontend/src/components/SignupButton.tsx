import {
    Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import _ from 'lodash';
import { signupForJob, removeSignup, signupForJobFreeForm } from '../controller/job';
import { UserContext } from '../contexts/UserContext';

interface buttonProps {
    jobId: number,
    member: string,
    start: string,
    memberId: number,
    refreshData: any,
}

export default function SignupButton(props: buttonProps) {
    const { state } = useContext(UserContext);
    const [paidLabor, setPaidLabor] = useState<string>('');
    const [jobMemberId] = useState(props.memberId);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [jobId] = useState(props.jobId);
    const toast = useToast();
    const handleClick = async () => {
        if (Date.parse(props.start) >= Date.now()) {
            const memberId = state?.user?.memberId;
            if (memberId) {
                await signupForJob(state.token, jobId, memberId);
            }
            await props.refreshData();
        } else {
            toast({
                containerStyle: {
                    background: 'orange',
                },
                // eslint-disable-next-line max-len
                title: 'This event has already passed, and is no longer eligible for signups',
                description: `Job ID ${props.jobId}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    let signupButton;
    if (!props.member) {
        signupButton = (
            <>
                <Button
                    // variant={verified ? 'verified' : 'unverified'}
                    aria-label="Sign Up"
                    background="orange.300"
                    color="white"
                    onClick={handleClick}
                >
                    Signup &nbsp;
                    {state.user?.firstName}
                </Button>
                <Button
                    backgroundColor="orange.300"
                    color="white"
                    ml={3}
                    onClick={onOpen}
                >
                    Sign Up Non Member
                </Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Non Member</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            You can use this window to add a non member to a job.  Adding a member this way
                            will cause their points to not be counted for this job, so please add non members only.
                            This just stores the name you enter as it&apos;s entered, and doesn&apos;t
                            link to a member record.
                            <Input
                                placeholder="Non Member Name"
                                onChange={
                                    (e) => {
                                        if (e.target.value?.length === 1) {
                                            e.target.value = _.startCase(e.target.value);
                                        }
                                        setPaidLabor(e.target.value);
                                    }
                                }
                            />
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                backgroundColor="orange.300"
                                color="white"
                                onClick={
                                    async () => {
                                        await signupForJobFreeForm(state.token, props.jobId, paidLabor);
                                        await props.refreshData();
                                        onClose();
                                    }
                                }
                            >
                                Save
                            </Button>
                            <Button ml={3} color="white" onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        );
    } else {
        // I can delete my own signups, and of course admins can delete everyone's signups.
        const allowDelete = (
            (state?.user?.memberId === jobMemberId) ||
            (state.user?.memberType === 'Admin')
        );
        signupButton = (
            <Button
                aria-label="Remove"
                background="red"
                color="white"
                onClick={
                    async () => {
                        await removeSignup(state.token, jobId);
                        await props.refreshData();
                    }
                }
                disabled={!allowDelete}
            >
                Remove Signup
            </Button>
        );
    }
    return signupButton;
}
