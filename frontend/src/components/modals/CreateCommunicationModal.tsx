import React, { useState } from 'react';
import {
    Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Button, Checkbox, CheckboxGroup, Divider,
    Grid, GridItem, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Select,
    Text, Textarea,
} from '@chakra-ui/react';
import { MembershipTag } from '../../../../src/typedefs/membershipTag';
import { createCommunication } from '../../controller/communication';
import { MemberCommunication } from '../../../../src/typedefs/memberCommunication';

interface CreateCommunicationModalProps {
    isOpen: boolean,
    token: string,
    userId: number,
    onClose: () => void,
    tags?: MembershipTag[],
    addAction: () => void,
}

export default function CreateCommunicationModal(props: CreateCommunicationModalProps) {
    // internal state management for the UI.
    const [characterLimit, setCharacterLimit] = useState<number>(4000);
    const [characterCount, setCharacterCount] = useState<number>(0);

    const [totalCount, setTotalCount] = useState<number>(0);

    // Data that gets pushed across the wire.
    const [subject, setSubject] = useState<string>('');
    const [mechanism, setMechanism] = useState<string>('EMAIL');
    const [messageText, setMessageText] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<any>([]);

    const { tags, token, userId } = props;

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
                            delete selectedTags[tag.value];
                            setSelectedTags(selectedTags);
                        } else {
                            selectedTags[tag.value] = tag;
                            setSelectedTags(selectedTags);
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
                                onChange={
                                    (e) => {
                                        setSubject(e.target.value);
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
                                            Audience Tags (choose zero to many).
                                            Choose no tags to send to all members.
                                        </Text>
                                    </AccordionButton>
                                    <AccordionPanel>
                                        <Text fontSize="xs">
                                            {`${totalCount} ${mechanism.toLowerCase()}(s) with selected tag(s).  `}
                                            Note that duplicates will be filters when the message is sent, and some
                                            members can have the same tag.
                                        </Text>
                                        <Grid templateRows="repeat(5, 1fr)" templateColumns="repeat(3, 1fr)">
                                            <CheckboxGroup>
                                                {tagCheckBoxes}
                                            </CheckboxGroup>
                                        </Grid>
                                    </AccordionPanel>
                                </AccordionItem>
                            </Accordion>
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Communication Content</Text>
                            <Textarea
                                size="lg"
                                isRequired
                                onChange={
                                    (e) => {
                                        let content = e.target.value;
                                        if (content.length > characterLimit) {
                                            e.target.value = content.substring(0, characterLimit);
                                            content = e.target.value;
                                        }
                                        setMessageText(content);
                                        setCharacterCount(content.length);
                                    }
                                }
                            />
                            <Text fontSize="xs">
                                {`${characterCount} / ${characterLimit} character limit`}
                            </Text>
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
                                setCharacterCount(0);
                                setSelectedTags([]);
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
                                const communication : MemberCommunication = {
                                    subject,
                                    mechanism,
                                    text: messageText,
                                    senderId: userId,
                                    selectedTags: Object.keys(selectedTags),
                                };
                                await createCommunication(token, communication);
                                setCharacterCount(0);
                                setSelectedTags([]);
                                props.addAction();
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
CreateCommunicationModal.defaultProps = {
    tags: [],
};
