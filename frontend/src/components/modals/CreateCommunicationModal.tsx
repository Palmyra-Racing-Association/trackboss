import React, { useState } from 'react';
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Checkbox, Divider,
    Grid, GridItem, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Select,
    Text, Textarea,
} from '@chakra-ui/react';
import { MembershipTag } from '../../../../src/typedefs/membershipTag';

interface CreateCommunicationModalProps {
    isOpen: boolean,
    // token: string,
    // userId: number,
    onClose: () => void,
    // eslint-disable-next-line react/require-default-props
    tags?: MembershipTag[],
    // addAction: () => void,
}

export default function CreateCommunicationModal(props: CreateCommunicationModalProps) {
    // internal state management for the UI.
    const [characterLimit, setCharacterLimit] = useState<number>(140);
    const [totalCount, setTotalCount] = useState<number>(0);

    // Data that gets pushed across the wire.
    const [subject, setSubject] = useState<string>('');
    const [mechanism, setMechanism] = useState<string>('EMAIL');
    const [messageText, setMessageText] = useState<string>('');

    const { tags } = props;

    const tagCheckBoxes = tags?.map((tag) => {
        const tagCheckBox = (
            <Checkbox
                colorScheme="orange"
                key={tag.id}
                onChange={
                    (e) => {
                        // tie the tag count to the checkbox, then subtract it if the box is unchecked.
                        // this allows updating the count in the UI in a fancy way.
                        let tagCount = tag.count || 0;
                        if (!e.target.checked) {
                            tagCount *= -1;
                        }
                        setTotalCount(totalCount + tagCount);
                    }
                }
            >
                <Text fontSize="sm">{tag.value}</Text>
            </Checkbox>
        );
        return tagCheckBox;
    });

    return (
        <Modal isCentered size="lg" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Add a communication to PRA membership
                </Heading>
                <Divider />
                <ModalBody>
                    <Grid columnGap={2} rowGap={2}>
                        <GridItem colSpan={2}>
                            <Text>Subject</Text>
                            <Input
                                size="md"
                                onChange={
                                    (e) => {
                                        setSubject(e.target.value);
                                        console.log(subject);
                                    }
                                }
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Communication Type</Text>
                            <Select
                                colorScheme="orange"
                                onChange={
                                    (e) => {
                                        const selectedType = e.target.value;
                                        if (selectedType === 'TEXT') {
                                            setCharacterLimit(140);
                                        } else {
                                            setCharacterLimit(4000);
                                        }
                                        setMechanism(selectedType);
                                        console.log(mechanism);
                                    }
                                }
                            >
                                <option value="EMAIL">Email</option>
                                <option value="TEXT">Text (limited to 140 characters)</option>
                            </Select>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Accordion allowToggle>
                                <AccordionItem>
                                    <AccordionButton>
                                        <AccordionIcon />
                                        <Text fontSize="sm">
                                            Audience Tags (choose one or many).
                                            Choosing no tags will send to all members.
                                        </Text>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <Text fontSize="xs">{`${totalCount} ${mechanism} with selected tag(s)`}</Text>
                                        <Grid templateRows="repeat(5, 1fr)" templateColumns="repeat(3, 1fr)">
                                            {tagCheckBoxes}
                                        </Grid>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Communication Content</Text>
                            <Textarea
                                size="lg"
                                onChange={
                                    (e) => {
                                        let content = e.target.value;
                                        if (content.length > characterLimit) {
                                            e.target.value = content.substring(0, characterLimit);
                                            content = e.target.value;
                                        }
                                        setMessageText(content);
                                        console.log(messageText);
                                    }
                                }
                            />
                        </GridItem>
                    </Grid>
                </ModalBody>
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
                            async () => {
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
