/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    useDisclosure,
    Button,
    Center,
    Divider,
    Heading,
    ModalBody,
    ModalFooter,
    SimpleGrid,
    VStack,
    Text,

} from '@chakra-ui/react';
import DateTimePicker from 'react-datetime-picker';
import { makeEvent } from '../controller/event';
import { getMockedEventTypeList } from '../controller/eventType';
import { getEventMonthDaySpan, getEventStartAndEndTime } from '../controller/utils';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
}

export default function SignUpModal(props: modalProps) {
    return (
        <Modal size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                TESTING
                <Divider />
                <ModalCloseButton />
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="sm"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
