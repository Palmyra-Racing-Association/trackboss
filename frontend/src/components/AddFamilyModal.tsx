import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    Heading,
    Text,
    SimpleGrid,
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
                <Heading pl={2} pr={2} textAlign="center">
                    Add family member
                </Heading>
                <Divider />
                <SimpleGrid>
                    <Text>stuff</Text>
                </SimpleGrid>
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
