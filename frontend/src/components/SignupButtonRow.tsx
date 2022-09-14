import {
    Button, ButtonGroup, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, useDisclosure, useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import _ from 'lodash';
import { BsCurrencyDollar, BsTrash2 } from 'react-icons/bs';

import { signupForJob, removeSignup, signupForJobFreeForm, setPaidState } from '../controller/job';
import { UserContext } from '../contexts/UserContext';
import MemberSelector from './shared/MemberSelector';

export default function SignupButtonRow(props: any) {
    const { state } = useContext(UserContext);
    const [paidLabor, setPaidLabor] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<any>();
    const [markedPaid, setMarkedPaid] = useState<boolean>(props.data.paid);

    const [jobMemberId, setJobMemberId] = useState(props.data.memberId);

    const {
        isOpen: isNonMemberOpen,
        onOpen: onNonMemberOpen,
        onClose: onNonMemberClose,
    } = useDisclosure();

    const [jobId] = useState(props.data.jobId);

    const isAdmin = state.user?.memberType === 'Admin';

    const eventAllowsPayment = ((props.eventType.toLowerCase() === 'race') ||
        (props.eventType.toLowerCase() === 'harescramble')
    );

    useEffect(() => {
        async function signupForJobDropdown() {
            await signupForJob(state.token, props.data.jobId, selectedOption.value);
            props.refreshData();
        }
        signupForJobDropdown();
    }, [selectedOption]);

    const toast = useToast();
    const handleSelfSignupClick = async () => {
        if (Date.parse(props.data.start) >= Date.now()) {
            const memberId = state?.user?.memberId;
            if (memberId) {
                await signupForJob(state.token, jobId, memberId);
            }
            setJobMemberId(memberId || -1);
            await props.refreshData();
        } else {
            toast({
                containerStyle: {
                    background: 'orange',
                },
                // eslint-disable-next-line max-len
                title: 'This event has already passed, and is no longer eligible for signups',
                description: `Job ID ${props.data.jobId}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    let signupButton;
    if (!props.data.member) {
        signupButton = (
            <SimpleGrid columns={[1, null, 3]} spacing="20px">
                {
                    !isAdmin && (
                        <Button
                            // variant={verified ? 'verified' : 'unverified'}
                            aria-label="Sign Up"
                            background="orange.300"
                            size="md"
                            color="white"
                            ml={10}
                            maxWidth={200}
                            onClick={handleSelfSignupClick}
                        >
                            Signup &nbsp;
                            {state.user?.firstName}
                        </Button>
                    )
                }
                {
                    isAdmin && (
                        <>
                            <MemberSelector
                                isAdmin
                                setSelectedOption={setSelectedOption}
                            />
                            <Button
                                backgroundColor="orange.300"
                                color="white"
                                maxWidth={200}
                                onClick={onNonMemberOpen}
                            >
                                Sign Up Non Member
                            </Button>
                        </>
                    )
                }
                <Modal isOpen={isNonMemberOpen} onClose={onNonMemberClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Add Non Member</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            You can use this window to add a non member to a job.  Adding a member this way
                            will cause their points to not be counted for this job, so please use the dropdown for that.
                            This way stores the name you enter as it&apos;s entered, and doesn&apos;t
                            link to a member record.
                            <Input
                                placeholder="Non Member Name"
                                onChange={
                                    (nonMemberEvent) => {
                                        if (nonMemberEvent.target.value?.length === 1) {
                                            nonMemberEvent.target.value = _.startCase(nonMemberEvent.target.value);
                                        }
                                        setPaidLabor(nonMemberEvent.target.value);
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
                                        await signupForJobFreeForm(state.token, props.data.jobId, paidLabor);
                                        await props.refreshData();
                                        setMarkedPaid(true);
                                        onNonMemberClose();
                                    }
                                }
                            >
                                Save
                            </Button>
                            <Button ml={3} color="white" onClick={onNonMemberClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </SimpleGrid>
        );
    } else {
        // I can delete my own signups, and of course admins can delete everyone's signups.
        const allowDelete = (
            (state?.user?.memberId === jobMemberId) ||
            (isAdmin)
        );
        signupButton = (
            <ButtonGroup variant="outline" ml={10} spacing="6">
                <Button
                    aria-label="Remove"
                    background="red"
                    color="white"
                    rightIcon={<BsTrash2 />}
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
                <Button
                    background={markedPaid ? 'orange.300' : 'green'}
                    color="white"
                    rightIcon={<BsCurrencyDollar />}
                    onClick={
                        async () => {
                            await setPaidState(state.token, jobId);
                            setMarkedPaid(!markedPaid);
                            await props.refreshData();
                        }
                    }
                    disabled={!props.data.cashPayout}
                    hidden={(!eventAllowsPayment || !isAdmin)}
                >
                    {markedPaid ? 'Unmark paid' : 'Mark as Paid' }
                </Button>
            </ButtonGroup>
        );
    }
    return signupButton;
}
