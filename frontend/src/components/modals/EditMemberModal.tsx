// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {
    Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Text, useDisclosure, VStack,
} from '@chakra-ui/react';

import { Member } from '../../../../src/typedefs/member';

interface EditMemberModalProps {
    // eslint-disable-next-line react/no-unused-prop-types
    member: Member,
}

// eslint-disable-next-line no-unused-vars
export default function EditMemberModal(props: EditMemberModalProps) {
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();

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
                    <ModalHeader>{`Edit member info - ${props.member.firstName} ${props.member.lastName}`}</ModalHeader>
                    <ModalBody>
                        <VStack>
                            <HStack>
                                <Text>Street Address</Text>
                                <Input placeholder={props.member.address} />
                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack>
                                <Text>City</Text>
                                <Input placeholder={props.member.city} />
                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack>
                                <Text>State</Text>
                                <Input placeholder={props.member.state} />
                            </HStack>
                        </VStack>
                        <VStack>
                            <HStack>
                                <Text>Zip</Text>
                                <Input placeholder={props.member.zip} />
                            </HStack>
                        </VStack>
                    </ModalBody>
                </ModalContent>
                <ModalFooter />
            </Modal>
        </>
    );
}
