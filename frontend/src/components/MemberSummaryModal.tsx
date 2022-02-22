/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    Text,
    SimpleGrid,
    Heading,
    VStack,
    Divider,
    Container,
    Editable,
    HStack,
    UnorderedList,
    ListItem,
    EditableInput,
    EditablePreview,
    ButtonGroup,
} from '@chakra-ui/react';
import { getMockedEventTypeList } from '../controller/eventType';

export default function MemberSummaryModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [startDateTime, setStartDateTime] = useState(new Date());
    const [endDateTime, setEndDateTime] = useState(new Date());
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [eventTypeId, setEventTypeId] = useState(0);
    const [eventTypes, setEventTypes] = useState([{}]);

    useEffect(() => {
        async function getData() {
            const types = await getMockedEventTypeList();
            setEventTypes(types);
        }
        getData();
    }, []);

    return (
        <div>
            <Button background="orange.300" color="white" onClick={onOpen}>Member Summary Modal</Button>
            <Modal size="xl" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent pb={5}>
                    <ModalHeader><Heading textAlign="center">Member Summary</Heading></ModalHeader>
                    <Divider />
                    <ModalCloseButton />
                    <ModalBody>
                        <SimpleGrid columns={2} spacing={4}>
                            <VStack borderRightWidth={1} borderRightColor="light-grey" align="left">
                                <HStack>
                                    <Text textAlign="left" fontSize="3xl" fontWeight="bold">Contact Info</Text>
                                    <Button textDecoration="underline" color="orange" variant="ghost">Edit</Button>
                                </HStack>
                                <SimpleGrid pb={4} columns={2}>
                                    <VStack maxWidth={40} spacing={3} align="left">
                                        <Text fontWeight="bold" mt={1}>Name:</Text>
                                        <Text fontWeight="bold">Email:</Text>
                                        <Text fontWeight="bold">Phone:</Text>
                                    </VStack>
                                    <VStack ml="-65px" align="left">
                                        <Editable defaultValue="John Smith">
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                        <Editable defaultValue="testing@gmail.com">
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                        <Editable defaultValue="123-456-7890">
                                            <EditablePreview />
                                            <EditableInput />
                                        </Editable>
                                    </VStack>
                                </SimpleGrid>
                                <HStack>
                                    <Text textAlign="left" fontSize="3xl" fontWeight="bold">Family</Text>
                                    <Button textDecoration="underline" color="orange" variant="ghost">Edit</Button>
                                </HStack>
                                <Text textAlign="left" fontSize="1xl" fontWeight="bold">Members</Text>
                                <UnorderedList pl={10}>
                                    <ListItem>john smith</ListItem>
                                    <ListItem>jane smith</ListItem>
                                    <ListItem>jim smith</ListItem>
                                </UnorderedList>
                                <Text textAlign="left" fontSize="1xl" fontWeight="bold">Bikes</Text>
                                <UnorderedList pl={10}>
                                    <ListItem>2012, honda</ListItem>
                                    <ListItem>2019, KTM</ListItem>
                                </UnorderedList>
                            </VStack>
                            <VStack align="left">
                                <HStack>
                                    <Text textAlign="left" fontSize="3xl" fontWeight="bold">Roles</Text>
                                    <Button textDecoration="underline" color="orange" variant="ghost">Edit</Button>
                                </HStack>
                                <ButtonGroup size="sm" isAttached variant="outline">
                                    <Button mr="-px">Member</Button>
                                    <Button mr="-px">Admin</Button>
                                    <Button mr="-px">Board</Button>
                                </ButtonGroup>
                                <Container pt={20} mb={20} />
                                <Text textAlign="left" fontSize="3xl" fontWeight="bold">Actions</Text>
                                <HStack size="lg">
                                    <Button
                                        variant="outline"
                                        style={
                                            {
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                            }
                                        }
                                    >
                                        Assign To Event

                                    </Button>
                                    <Button
                                        backgroundColor="red"
                                        variant="outline"
                                        style={
                                            {
                                                whiteSpace: 'normal',
                                                wordWrap: 'break-word',
                                            }
                                        }
                                    >
                                        De-Activate Member

                                    </Button>
                                </HStack>
                                <Button
                                    textDecoration="underline"
                                    color="orange"
                                    variant="ghost"
                                >
                                    Reset Password
                                </Button>
                            </VStack>
                        </SimpleGrid>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
}
