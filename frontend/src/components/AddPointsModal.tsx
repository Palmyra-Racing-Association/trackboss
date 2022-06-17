import React, { useState } from 'react';
import {
    Button,
    IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField,
    NumberInputStepper, useDisclosure, useToast, VStack,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';
import moment from 'moment';

import { createJobType } from '../controller/jobType';
import { JobType, PostNewJobTypeRequest } from '../../../src/typedefs/jobType';
import { Job, PostNewJobRequest } from '../../../src/typedefs/job';
import { createJob } from '../controller/job';

interface AddPointsModalProps {
    memberName: string,
    memberId: number,
    visible: boolean,
    refreshPoints: Function,
    token: string,
}
export default function AddPointsModal(props: AddPointsModalProps) {
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();
    const [description, setDescription] = useState<string>('');
    const [pointValue, setPointValue] = useState<number>();
    const [dirty, setDirty] = useState<boolean>(false);
    const toast = useToast();

    return (
        <>
            <IconButton
                aria-label="add"
                icon={<BsPlus />}
                background="orange"
                color="white"
                hidden={!props.visible}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{`Add Points to ${props.memberName}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Input
                                placeholder="Description of work performed"
                                value={description}
                                size="md"
                                onChange={
                                    (e) => {
                                        setDescription(e.target.value);
                                        setDirty(true);
                                    }
                                }
                            />
                            <NumberInput min={1} max={30} step={0.25}>
                                <NumberInputField
                                    placeholder="Points earned"
                                    value={pointValue}
                                    onChange={
                                        (e) => {
                                            setPointValue(Number(e.target.value));
                                            setDirty(true);
                                        }
                                    }
                                />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            mr={4}
                            backgroundColor="orange"
                            disabled={!dirty}
                            color="white"
                            onClick={
                                async () => {
                                    const createJobTypeRequest : PostNewJobTypeRequest = {
                                        title: description,
                                        pointValue,
                                        cashValue: 0,
                                        reserved: false,
                                        online: true,
                                        mealTicket: false,
                                        modifiedBy: props.memberId,
                                    };
                                    const createdJobType : JobType =
                                        await createJobType(props.token, createJobTypeRequest) as JobType;
                                    const rightNow = moment().format('YYYY-MM-DD HH:mm');
                                    const createJobRequest : PostNewJobRequest = {
                                        jobTypeId: createdJobType.jobTypeId,
                                        memberId: props.memberId,
                                        jobStartDate: rightNow,
                                        jobEndDate: rightNow,
                                        pointsAwarded: createdJobType.pointValue,
                                        cashPayout: 0,
                                        verified: true,
                                        paid: false,
                                        verifiedDate: rightNow,
                                        modifiedBy: props.memberId,
                                    };
                                    const createdJob : Job =
                                        await createJob(props.token, createJobRequest) as Job;
                                    props.refreshPoints();
                                    setPointValue(0);
                                    setDescription('');
                                    onClose();
                                    toast({
                                        containerStyle: {
                                            background: 'orange',
                                        },
                                        // eslint-disable-next-line max-len
                                        title: 'Points entry created!',
                                        description: `${JSON.stringify(createdJob)}`,
                                        status: 'success',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                }
                            }
                        >
                            Save
                        </Button>
                        <Button backgroundColor="white" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
