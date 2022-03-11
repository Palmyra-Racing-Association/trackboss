import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    Text,
    ModalFooter,
    Divider,
} from '@chakra-ui/react';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
}

export default function AddFamilyModal(props: modalProps) {
    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Text fontSize="2xl" pl={2} pr={2} textAlign="center">
                    Please contact a club board member to add members to your membership.
                </Text>
                <Divider />
                <ModalFooter>
                    <Button
                        color="green"
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Accept
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
