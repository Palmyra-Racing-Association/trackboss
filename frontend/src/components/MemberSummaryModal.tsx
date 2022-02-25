/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    SimpleGrid,
    Heading,
    VStack,
    Divider,
    Container,
    HStack,
    UnorderedList,
    ListItem,
    ButtonGroup,
    Input,
    Select,
} from '@chakra-ui/react';
import { Member } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import memberHandlers from '../mocks/memberHandlers';

interface modalProps {
    isOpen: boolean,
    onClose: () => void,
    memberInfo: Member,
    memberFamily: Member[],
    memberBikes: Bike[],
    // admin: boolean, // TODO: this will come from state
}

async function handleNewBoardMember(memberInfo: Member, editedBoardMember: string) {
    // const currentYear = new Date().getFullYear();
    // const boardRoleId = getBoardRoleId(editedBoardMember); // Util method?
    // const response = await newBoardMember(currentYear,boardRoleId, memberInfo.memberId);
    // return response;
}

async function handlePatchMemberType(memberInfo: Member, editedMemberType: string) {
    // const updatedMember = await patchMember(editedMemberType, memberInfo.memberId)
    // if (updatedMember.reason) {
    //   there was an error, show error message
    // }
}

async function handlePatchMemberContactInfo(
    memberInfo: Member,
    name: string | undefined,
    email: string | undefined,
    phone: string | undefined,
) {
    // const updatedMember = await patchMember(name, email, phone, memberInfo.memberId)
    // if (updatedMember.reason) {
    //      there was an error, show error message
    // }

    const updatedMember: Member = {
        memberId: 1,
        membershipAdmin: 'true',
        active: true,
        memberType: 'member',
        firstName: 'Updated',
        lastName: 'Member',
        phoneNumber: '0987',
        email: 'updatedMember@example.com',
        uuid: '',
        occupation: '',
        birthdate: '',
        dateJoined: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    };

    return updatedMember;
}

export default function MemberSummaryModal(props: modalProps) {
    const [selectedMember, setSelectedMember] = useState<Member>();
    // const [family, setFamily] = useState<Member[]>();
    const [bikes, setBikes] = useState<Bike[]>();

    const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);
    const [editingMemberRole, setEditingMemberRole] = useState<boolean>(false);

    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedPhone, setEditedPhone] = useState<string>('');

    const [editedMemberType, setEditedMemberType] = useState<string>('');
    const [editedBoardMember, setEditedBoardMember] = useState<string>('');

    const handleEditedNameChange = (event: { target: { value: any; }; }) => setEditedName(event.target.value);
    const handleEditedEmailChange = (event: { target: { value: any; }; }) => setEditedEmail(event.target.value);
    const handleEditedPhoneChange = (event: { target: { value: any; }; }) => setEditedPhone(event.target.value);
    const handleEditedBoardMember = (event: { target: { value: any; }; }) => setEditedBoardMember(event.target.value);

    useEffect(() => {
        async function setModalData() {
            setSelectedMember(props.memberInfo);
            setEditedMemberType(props.memberInfo.memberType);
            // setFamily(props.memberFamily);
            setBikes(props.memberBikes);
        }
        setModalData();
    }, [props.memberInfo, props.memberInfo.memberType]);

    return (
        <Modal
            isCentered
            size="xl"
            isOpen={props.isOpen}
            onClose={props.onClose}
        >
            <ModalOverlay />
            <ModalContent pb={5}>
                <ModalHeader><Heading textAlign="center">Member Summary</Heading></ModalHeader>
                <Divider />
                <ModalCloseButton />
                <ModalBody>
                    {
                        selectedMember && bikes && (
                            <SimpleGrid columns={2} spacing={4}>
                                <VStack borderRightWidth={1} borderRightColor="light-grey" align="left">
                                    <HStack>
                                        <Text textAlign="left" fontSize="3xl" fontWeight="bold">Contact Info</Text>
                                        {
                                            selectedMember.membershipAdmin === 'true' && (
                                                <Button
                                                    textDecoration="underline"
                                                    color="orange"
                                                    variant="ghost"
                                                    onClick={
                                                        () => {
                                                            if (editingMemberInfo) {
                                                                setEditingMemberInfo(false);
                                                            } else {
                                                                setEditingMemberInfo(true);
                                                            }
                                                        }
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }
                                    </HStack>
                                    <SimpleGrid pb={4} columns={2}>
                                        <VStack maxWidth={40} spacing={2} align="left">
                                            <Text fontWeight="bold">Name:</Text>
                                            <Text fontWeight="bold">Email:</Text>
                                            <Text fontWeight="bold">Phone:</Text>
                                        </VStack>
                                        {
                                            editingMemberInfo ? (
                                                <VStack ml="-65px" align="left">
                                                    <Input
                                                        placeholder={`${selectedMember.firstName} ${selectedMember.lastName}`}
                                                        value={editedName}
                                                        onChange={handleEditedNameChange}
                                                        size="xs"
                                                    />
                                                    <Input
                                                        placeholder={selectedMember.email}
                                                        value={editedEmail}
                                                        onChange={handleEditedEmailChange}
                                                        size="xs"
                                                    />
                                                    <Input
                                                        placeholder={selectedMember.phoneNumber}
                                                        value={editedPhone}
                                                        onChange={handleEditedPhoneChange}
                                                        size="xs"
                                                    />
                                                    <Button
                                                        ml={10}
                                                        variant="outline"
                                                        size="xs"
                                                        color="green"
                                                        onClick={
                                                            async () => {
                                                                setSelectedMember(await handlePatchMemberContactInfo(selectedMember, editedName, editedEmail, editedPhone));
                                                                setEditingMemberInfo(false);
                                                                setEditingMemberRole(false);
                                                            }
                                                        }
                                                    >
                                                        Save
                                                    </Button>
                                                </VStack>
                                            ) : (
                                                <VStack ml="-65px" align="left">
                                                    <Text>
                                                        {`${selectedMember.firstName} ${selectedMember.lastName}`}
                                                    </Text>
                                                    <Text>{selectedMember.email}</Text>
                                                    <Text>{selectedMember.phoneNumber}</Text>
                                                </VStack>
                                            )
                                        }
                                    </SimpleGrid>
                                    <HStack>
                                        <Text textAlign="left" fontSize="3xl" fontWeight="bold">Family</Text>
                                        {/* {
                                                memberInfo.membershipAdmin === 'true' && (
                                                    <Button
                                                        textDecoration="underline"
                                                        color="orange"
                                                        variant="ghost"
                                                    >
                                                        Edit
                                                    </Button>
                                                )
                                            } */}
                                    </HStack>
                                    <Text textAlign="left" fontSize="1xl" fontWeight="bold">Members</Text>
                                    <UnorderedList pl={10}>
                                        {
                                            props.memberFamily.map((member) => (
                                                member.memberId === selectedMember.memberId ? <ListItem key={member.memberId}>{`${member.firstName} ${member.lastName} (you)`}</ListItem>
                                                    : <ListItem key={member.memberId}>{`${member.firstName} ${member.lastName}`}</ListItem>
                                            ))
                                        }
                                    </UnorderedList>
                                    <Text textAlign="left" fontSize="1xl" fontWeight="bold">Bikes</Text>
                                    <UnorderedList pl={10}>
                                        {
                                            props.memberBikes.map((bike) => (
                                                <ListItem key={bike.bikeId}>{`${bike.year}, ${bike.make} ${bike.model}`}</ListItem>
                                            ))
                                        }
                                    </UnorderedList>
                                </VStack>
                                <VStack align="left">
                                    <HStack>
                                        <Text
                                            textAlign="left"
                                            fontSize="3xl"
                                            fontWeight="bold"
                                        >
                                            Roles
                                        </Text>
                                        {
                                            selectedMember.membershipAdmin === 'true' && (
                                                <Button
                                                    textDecoration="underline"
                                                    color="orange"
                                                    variant="ghost"
                                                    onClick={
                                                        () => {
                                                            if (editingMemberRole) {
                                                                setEditingMemberRole(false);
                                                            } else {
                                                                setEditingMemberRole(true);
                                                            }
                                                        }
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }
                                    </HStack>
                                    {
                                        editingMemberRole ? (
                                            <VStack align="left">
                                                <ButtonGroup size="sm" isAttached variant="outline">
                                                    <Button
                                                        onClick={
                                                            async () => {
                                                                if (editedMemberType !== 'member') {
                                                                    await setEditedMemberType('member');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={editedMemberType === 'member' ? 'blue' : ''}
                                                    >
                                                        Member
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            async () => {
                                                                if (editedMemberType !== 'admin') {
                                                                    await setEditedMemberType('admin');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={editedMemberType === 'admin' ? 'blue' : ''}
                                                    >
                                                        Admin
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            async () => {
                                                                if (editedMemberType !== 'board') {
                                                                    await setEditedMemberType('board');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={editedMemberType === 'board' ? 'blue' : ''}
                                                    >
                                                        Board
                                                    </Button>
                                                </ButtonGroup>
                                                <Select
                                                    disabled={editedMemberType !== 'board'}
                                                    variant="outline"
                                                    size="xs"
                                                    placeholder={selectedMember.occupation}
                                                    value={editedBoardMember}
                                                    onChange={handleEditedBoardMember}
                                                >
                                                    {/* TODO: need the actual roles here */}
                                                    <option value="president">president</option>
                                                    <option value="vice president">vice president</option>
                                                    <option value="secretary">secretary</option>
                                                </Select>
                                                <Button
                                                    ml={10}
                                                    variant="outline"
                                                    size="xs"
                                                    color="green"
                                                    onClick={
                                                        async () => {
                                                            if (editedBoardMember !== '') {
                                                                await handleNewBoardMember(selectedMember, editedBoardMember);
                                                            }
                                                            if (selectedMember.memberType !== editedMemberType) {
                                                                await handlePatchMemberType(selectedMember, editedMemberType);
                                                            }
                                                            setEditingMemberRole(false);
                                                            setEditingMemberInfo(false);
                                                        }
                                                    }
                                                >
                                                    Save
                                                </Button>
                                            </VStack>
                                        ) : (
                                            <ButtonGroup size="sm" isAttached variant="outline">
                                                <Button
                                                    mr="-px"
                                                    backgroundColor={selectedMember.memberType === 'member' ? 'blue' : ''}
                                                >
                                                    Member
                                                </Button>
                                                <Button
                                                    userSelect="none"
                                                    mr="-px"
                                                    backgroundColor={selectedMember.memberType === 'admin' ? 'blue' : ''}
                                                >
                                                    Admin
                                                </Button>
                                                <Button
                                                    mr="-px"
                                                    backgroundColor={selectedMember.memberType === 'board' ? 'blue' : ''}
                                                >
                                                    Board
                                                </Button>
                                            </ButtonGroup>
                                        )
                                    }
                                    <Container pt={20} mb={20} />
                                    <Text textAlign="left" fontSize="3xl" fontWeight="bold">Actions</Text>
                                    <HStack align="left">
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
                        )
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
