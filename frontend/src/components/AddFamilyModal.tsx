import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    Heading,
    ModalFooter,
    Divider,
    Box,
    Input,
    NumberInput,
    NumberInputField,
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
                <Box width={300}>
                    <Box>
                        <Input
                            placeholder="First Name"
                        />
                    </Box>
                    <Box>
                        <Input
                            placeholder="Last Name"
                        />
                    </Box>
                    <Box>
                        <NumberInput min={0} max={99} step={1}>
                            <NumberInputField
                                placeholder="Age"
                                onChange={
                                    (event) => {
                                        console.log(event.target.value);
                                    }
                                }
                            />
                        </NumberInput>
                    </Box>
                </Box>
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
