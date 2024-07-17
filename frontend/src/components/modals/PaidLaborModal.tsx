/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import {
    Button, Divider, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Text,
    Textarea,
} from '@chakra-ui/react';
import { PaidLabor } from '../../../../src/typedefs/paidLabor';

interface PaidLaborModalProps {
    laborer?: PaidLabor,
    isOpen: boolean,
    onClose: () => void,
}

export default function PaidLaborModal(props: PaidLaborModalProps) {
    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Update Paid Laborer
                </Heading>
                <Divider />
                <ModalBody>
                    hi
                </ModalBody>
                <ModalFooter>
                    <Button backgroundColor="white" onClick={props.onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    );
}
PaidLaborModal.defaultProps = {
    laborer: {},
};
