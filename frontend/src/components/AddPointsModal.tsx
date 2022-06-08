import React, { useState } from 'react';
import {
    Button,
    IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, NumberInput, NumberInputField, useDisclosure, VStack,
} from '@chakra-ui/react';
import { BsPlus } from 'react-icons/bs';

interface AddPointsModalProps {
    memberName: string,
    visible: boolean,
}
export default function AddPointsModal(props: AddPointsModalProps) {
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();
    const [description, setDescription] = useState<string>('');
    const [pointValue, setPointValue] = useState<number>();
    const [dirty, setDirty] = useState<boolean>(false);

    return (
        <>
            <IconButton
                aria-label="add"
                icon={<BsPlus />}
                background="orange"
                color="white"
                hidden={!props.visible}
                onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{`Add Points to ${props.memberName}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack>
                            <Input
                                placeholder="Description of work performed"
                                value={description}
                                size="md"
                                onChange={
                                    (e) => {
                                        setDescription(e.target.value);
                                        setDirty(true);
                                    }
                                }
                            />
                            <NumberInput min={1} max={30} step={1}>
                                <NumberInputField
                                    placeholder="Points earned"
                                    value={pointValue}
                                    onChange={
                                        (e) => {
                                            setPointValue(Number(e.target.value));
                                            setDirty(true);
                                        }
                                    }
                                />
                            </NumberInput>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={4} backgroundColor="orange" disabled={!dirty} color="white">
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
