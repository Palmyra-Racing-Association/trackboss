import React from 'react';
import {
    Button, Divider, Heading, Modal, ModalContent, ModalFooter, ModalOverlay,
} from '@chakra-ui/react';

interface alertProps {
    isOpen: boolean,
    // token: string,
    // userId: number,
    onClose: () => void,
    // addAction: () => void,
}

export default function CreateCommunicationModal(props: alertProps) {
    return (
        <Modal isCentered size="md" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Add a communication to PRA membership.
                </Heading>
                <Divider />
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
                            async () => {
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
