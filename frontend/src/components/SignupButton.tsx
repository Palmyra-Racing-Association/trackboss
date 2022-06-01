import {
    Box,
    Button, ButtonGroup, Input,
    Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure, useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import _ from 'lodash';
import { BsCurrencyDollar, BsTrash2 } from 'react-icons/bs';

import { signupForJob, removeSignup, signupForJobFreeForm, setPaidState } from '../controller/job';
import { UserContext } from '../contexts/UserContext';
import { Member } from '../../../src/typedefs/member';
import { getMemberList, getMembersByMembership } from '../controller/member';

interface buttonProps {
    jobId: number,
    member: string,
    start: string,
    memberId: number,
    paid: boolean,
    refreshData: any,
}

export default function SignupButton(props: buttonProps) {
    const { state } = useContext(UserContext);
    const [paidLabor, setPaidLabor] = useState<string>('');
    const [eligibleMembers, setEligibleMembers] = useState<any[]>([]);
    const [selectedOption, setSelectedOption] = useState<any>();
    const [markedPaid, setMarkedPaid] = useState<boolean>(props.paid);

    const [jobMemberId, setJobMemberId] = useState(props.memberId);

    const {
        isOpen: isNonMemberOpen,
        onOpen: onNonMemberOpen,
        onClose: onNonMemberClose,
    } = useDisclosure();

    const [jobId] = useState(props.jobId);

    const isAdmin = state.user?.memberType === 'Admin';

    useEffect(() => {
        async function getData() {
            let activeMembers = await getMembersByMembership(state.token, state.user?.membershipId || 0);
            if (isAdmin) {
                activeMembers = await getMemberList(state.token) as Member[];
            }
            activeMembers.sort((a, b) => a.lastName.localeCompare(b.lastName));
            const options = activeMembers.map((member) => {
                const option = {
                    value: member.memberId,
                    label: `${member.lastName}, ${member.firstName}`,
                };
                return option;
            });
            setEligibleMembers(options);
        }
        getData();
    }, []);

    useEffect(() => {
        async function signupForJobDropdown() {
            await signupForJob(state.token, props.jobId, selectedOption.value);
            props.refreshData();
        }
        signupForJobDropdown();
    }, [selectedOption]);

    const toast = useToast();
    const handleClick = async () => {
        if (Date.parse(props.start) >= Date.now()) {
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
                {
                    !isAdmin && (
                        <Button
                            // variant={verified ? 'verified' : 'unverified'}
                            aria-label="Sign Up"
                            background="orange.300"
                            size="md"
                            color="white"
                            ml={10}
                            onClick={handleClick}
                        >
                            Signup &nbsp;
                            {state.user?.firstName}
                        </Button>
                    )
                }
                {
                    isAdmin && (
                        <Box ml={10} width="100%">
                            <Select
                                placeholder="Choose a member or start typing to narrow down the list"
                                styles={
                                    {
                                        option: (provided, optionState) => ({
                                            ...provided,
                                            backgroundColor: optionState.isSelected ? '#ffa24d' : 'white',
                                            borderBottom: '1px solid #ffa24d',
                                        }),
                                    }
                                }
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                isSearchable
                                isClearable
                                backspaceRemovesValue
                                options={eligibleMembers}
                                value={selectedOption}
                                onChange={
                                    async (e) => {
                                        setSelectedOption(e);
                                    }
                                }
                            />
                            <Button
                                backgroundColor="orange.300"
                                color="white"
                                onClick={onNonMemberOpen}
                            >
                                Sign Up Non Member
                            </Button>
                        </Box>
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
                                        await signupForJobFreeForm(state.token, props.jobId, paidLabor);
                                        await props.refreshData();
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
            </>
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
                    hidden={(!isAdmin)}
                >
                    {markedPaid ? 'Unmark paid' : 'Mark as Paid' }
                </Button>
            </ButtonGroup>
        );
    }
    return signupButton;
}
