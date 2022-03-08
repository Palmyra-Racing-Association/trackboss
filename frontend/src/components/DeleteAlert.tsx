import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    Divider,
    Heading,
    ModalFooter,
    Text,
} from '@chakra-ui/react';

interface alertProps {
  isOpen: boolean,
  onClose: () => void,
  removeMethod: () => void,
}

export default function DeleteAlert(props: alertProps) {
    return (
        <Modal isCentered size="md" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Are you sure?
                </Heading>
                <Text textAlign="center" fontSize="2xl">You can&apos;t undo this action afterwards.</Text>
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
                            () => {
                                props.removeMethod();
                                props.onClose();
                            }
                        }
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
