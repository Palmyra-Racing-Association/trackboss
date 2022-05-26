import React, { useState } from 'react';
import {
    Box, Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, useDisclosure,
} from '@chakra-ui/react';
import _ from 'lodash';
import SignupButton from './SignupButton';
import { signupForJobFreeForm } from '../controller/job';

export default function SignupListRow(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [paidLabor, setPaidLabor] = useState<string>('');

    return (
        <Box m={3}>
            <SignupButton
                jobId={props.data.jobId}
                member={props.data.member}
                memberId={props.data.memberId}
                start={props.data.start}
                refreshData={props.refreshData}
            />
            {
                !props.data.member && (
                    <Button
                        backgroundColor="orange.300"
                        color="white"
                        ml={3}
                        onClick={onOpen}
                    >
                        Sign Up Non Member
                    </Button>
                )
            }
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
                            placeholder="Paid Laborer Name"
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
                            disabled={(paidLabor === undefined)}
                            onClick={
                                async () => {
                                    await signupForJobFreeForm(props.token, props.data.jobId, paidLabor);
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
        </Box>
    );
}
