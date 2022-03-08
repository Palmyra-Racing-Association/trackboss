import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Button,
    Divider,
    Heading,
    ModalFooter,
    VStack,
    Input,

} from '@chakra-ui/react';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  // eslint-disable-next-line no-unused-vars
  addMember: (firstName: string, lastName: string, email: string) => void
}

export default function AddFamilyModal(props: modalProps) {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleEditedFirstName = (event: { target: { value: any; }; }) => setFirstName(event.target.value);
    const handleEditedLastName = (event: { target: { value: any; }; }) => setLastName(event.target.value);
    const handleEditedEmail = (event: { target: { value: any; }; }) => setEmail(event.target.value);

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading pl={2} pr={2} textAlign="center">
                    Look Up Member To Add
                </Heading>
                <Divider mb={5} />
                <ModalCloseButton />
                <VStack
                    align="left"
                    mr={5}
                    ml={5}
                >
                    <Input
                        variant="outline"
                        placeholder="Member First Name"
                        value={firstName}
                        onChange={handleEditedFirstName}
                        size="md"
                    />
                    <Input
                        variant="outline"
                        placeholder="Member Last Name"
                        value={lastName}
                        onChange={handleEditedLastName}
                        size="md"
                    />
                    <Input
                        variant="outline"
                        placeholder="Member Email"
                        value={email}
                        onChange={handleEditedEmail}
                        size="md"
                    />
                </VStack>
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
                        Close
                    </Button>
                    <Button
                        color="green"
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.addMember(firstName, lastName, email);
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
