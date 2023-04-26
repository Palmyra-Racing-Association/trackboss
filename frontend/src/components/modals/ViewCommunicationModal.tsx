import React from 'react';
import {
    Button, Divider, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Text,
    Textarea,
} from '@chakra-ui/react';
import { MemberCommunication } from '../../../../src/typedefs/memberCommunication';

interface ViewCommunicationModalProps {
    communication?: MemberCommunication,
    isOpen: boolean,
    onClose: () => void,
}

export default function ViewCommunicationModal(props: ViewCommunicationModalProps) {
    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Communication to PRA membership
                </Heading>
                <Divider />
                <ModalBody>
                    <Grid columnGap={2} rowGap={2}>
                        <GridItem colSpan={2}>
                            <Text>Subject</Text>
                            <Input
                                size="md"
                                disabled
                                defaultValue={props.communication?.subject}
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Selected Tags</Text>
                            <Input
                                size="md"
                                disabled
                                defaultValue={props.communication?.selectedTags?.join(',')}
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Communication Type</Text>
                            <Input
                                size="md"
                                disabled
                                defaultValue={props.communication?.mechanism}
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Communication Content</Text>
                            <Textarea
                                minHeight={350}
                                size="lg"
                                isRequired
                                disabled
                                defaultValue={props.communication?.text}
                            />
                        </GridItem>
                    </Grid>
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
ViewCommunicationModal.defaultProps = {
    communication: {},
};
