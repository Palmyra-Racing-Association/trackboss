import React from 'react';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton,
    Button,
} from '@chakra-ui/react';

interface SimpleAlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string | undefined;
    title: string,
}

export default function SimpleAlertModal(props: SimpleAlertModalProps) {
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {props.message}
                </ModalBody>
                <ModalFooter>
                    <Button backgroundColor="orange" color="white" mr={3} onClick={props.onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
