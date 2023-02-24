import React, { useState } from 'react';
import {
    Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, SimpleGrid, Text, useDisclosure, VStack,
} from '@chakra-ui/react';

import { Member } from '../../../../src/typedefs/member';

interface EditMemberModalProps {
    // eslint-disable-next-line react/no-unused-prop-types
    member: Member,
}

// eslint-disable-next-line no-unused-vars
export default function EditMemberModal(props: EditMemberModalProps) {
    const selectedMember = props.member;
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();
    const [streetAddress, setStreetAddress] = useState<string>(selectedMember.address);
    const [city, setCity] = useState<string>(selectedMember.city);
    const [state, setState] = useState<string>(selectedMember.state);
    const [zip, setZip] = useState<string>(selectedMember.zip);
    const [phoneNumber, setPhoneNumber] = useState<string>(selectedMember.phoneNumber);
    const [email, setEmail] = useState<string>(selectedMember.email);
    const [dirty, setDirty] = useState<boolean>(false);
    return (
        <>
            <Button
                textDecoration="underline"
                color="orange"
                variant="ghost"
                onClick={onOpen}
            >
                Edit
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                        {`Edit member info - ${selectedMember.firstName} ${props.member.lastName}`}
                    </ModalHeader>
                    <ModalBody>
                        <SimpleGrid columns={1} spacing={2}>
                            <VStack align="left">
                                <HStack>
                                    <Text>Street Address</Text>
                                    <Input
                                        value={streetAddress}
                                        size="md"
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setStreetAddress(e.target.value);
                                            }
                                        }
                                    />
                                </HStack>
                                <HStack>
                                    <Text>City</Text>
                                    <Input
                                        value={city}
                                        size="md"
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setCity(e.target.value);
                                            }
                                        }
                                    />
                                </HStack>
                                <HStack>
                                    <Text>State</Text>
                                    <Input
                                        value={state}
                                        size="md"
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setState(e.target.value);
                                            }
                                        }
                                    />
                                    <Text>Zip</Text>
                                    <Input
                                        value={zip}
                                        size="md"
                                        width="auto"
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setZip(e.target.value);
                                            }
                                        }
                                    />
                                </HStack>
                            </VStack>
                            <VStack align="left">
                                <HStack>
                                    <Text>eMail</Text>
                                    <Input
                                        size="md"
                                        value={email}
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setEmail(e.target.value);
                                            }
                                        }
                                    />
                                </HStack>
                                <HStack>
                                    <Text>Phone</Text>
                                    <Input
                                        value={phoneNumber}
                                        size="md"
                                        onChange={
                                            (e) => {
                                                setDirty(true);
                                                setPhoneNumber(e.target.value);
                                            }
                                        }
                                    />
                                </HStack>
                            </VStack>
                        </SimpleGrid>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            mr={4}
                            backgroundColor="orange"
                            disabled={!dirty}
                            color="white"
                            onClick={
                                () => {
                                    selectedMember.address = streetAddress;
                                    selectedMember.city = city;
                                    selectedMember.state = state;
                                    selectedMember.zip = zip;
                                    selectedMember.email = email;
                                    selectedMember.phoneNumber = phoneNumber;
                                    alert(JSON.stringify(selectedMember));
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
