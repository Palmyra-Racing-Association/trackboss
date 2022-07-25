import {
    Button, Divider, Heading, Input, Modal, ModalContent, ModalFooter,
    ModalOverlay, SimpleGrid,
} from '@chakra-ui/react';
import React from 'react';
import { MembershipApplication } from '../../../../src/typedefs/membershipApplication';

interface appModalProps {
    // your data goes here.
    membershipApplication: MembershipApplication,
    isOpen: boolean,
    // typically the chakra useDisclosure passed from the parent.
    onClose: () => void,
    // callback function for throwing data back to the parent.
    addAction: () => void,
    token: string,
}

export default function MembershipApplicationModal(props: appModalProps) {
    const { membershipApplication, isOpen, onClose } = props;
    props.addAction();
    console.log(props.token);
    return (
        <Modal isCentered size="xl" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading>
                    Membership Application &nbsp; -
                    {membershipApplication.firstName}
                    &nbsp;
                    {membershipApplication.lastName}
                </Heading>
                <Divider />
                <SimpleGrid columns={[2, 3, 3]} spacing={2} m={3}>
                    <Input value={membershipApplication.firstName} />
                    <Input value={membershipApplication.lastName} />
                </SimpleGrid>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        color="red"
                        variant="ghost"
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
