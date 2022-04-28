/* eslint-disable max-len */
// this file goes very deep into the DOM tree and has very long lines as a result, although most of the lines are composed of spacing
// disabling max-len because there really isn't another super reasonable way to handle this
import _ from 'lodash';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
    useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { Member, PatchMemberRequest } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import { getMembersByMembership, updateMember } from '../controller/member';
import { getBikeList } from '../controller/bike';
import { BoardMemberType } from '../../../src/typedefs/boardMemberType';
import { createBoardMember, getBoardRoles, updateBoardMember } from '../controller/boardMember';

interface modalProps {
    isOpen: boolean,
    onClose: () => void,
    memberInfo: Member,
}

export default function MemberSummaryModal(props: modalProps) {
    const toast = useToast();
    const navigate = useNavigate();
    const navigateToCalendar = () => {
        const path = '/calendar';
        navigate(path);
    };

    const { state, update } = useContext(UserContext);

    const [selectedMember, setSelectedMember] = useState<Member>();
    const [family, setFamily] = useState<Member[]>();
    const [bikes, setBikes] = useState<Bike[]>();

    const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);
    const [editingMemberRole, setEditingMemberRole] = useState<boolean>(false);

    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedPhone, setEditedPhone] = useState<string>('');

    const [editedMemberType, setEditedMemberType] = useState<string>('');
    const [editedBoardMember, setEditedBoardMember] = useState<string>('');
    const [boardRoles, setBoardRoles] = useState<BoardMemberType[]>([]);
    const [isBoard, setIsBoard] = useState<boolean>(false);

    const handleEditedNameChange = (event: { target: { value: any; }; }) => setEditedName(event.target.value);
    const handleEditedEmailChange = (event: { target: { value: any; }; }) => setEditedEmail(event.target.value);
    const handleEditedPhoneChange = (event: { target: { value: any; }; }) => setEditedPhone(event.target.value);
    const handleEditedBoardMember = (event: { target: { value: any; }; }) => setEditedBoardMember(event.target.value);

    const [error, setError] = useState<string>('');

    const deactivateMember = useCallback(async () => {
        const response = await updateMember(state.token, props.memberInfo.memberId, { active: false, modifiedBy: state.user!.memberId });
        if ('reason' in response) {
            return false;
        }
        return true;
    }, [state, props.memberInfo]);

    const handlePatchMemberType = useCallback(async () => {
        let memberTypeId: number;
        if (editedMemberType === 'board') {
            if (isBoard) {
                const response = await updateBoardMember(
                    state.token,
                    props.memberInfo.boardMemberData!.boardId,
                    { boardMemberTitleId: Number(editedBoardMember) },
                );
                if ('reason' in response) {
                    setError(`error updating board member data: ${response.reason}`);
                }
            } else {
                const response = await createBoardMember(
                    state.token,
                    { boardMemberTitleId: Number(editedBoardMember), year: new Date().getFullYear(), memberId: props.memberInfo.memberId },
                );
                if ('reason' in response) {
                    setError(`error updating board member data: ${response.reason}`);
                }
            }
            memberTypeId = 1;
        } else if (editedMemberType === 'member') {
            memberTypeId = 3;
        } else if (editedMemberType === 'admin') {
            memberTypeId = 1;
        } else {
            return false;
        }
        const updatedMember = await updateMember(state.token, props.memberInfo.memberId, { memberTypeId, modifiedBy: state.user!.memberId });
        if ('reason' in updatedMember) {
            return false;
        }
        return true;
    }, [state, props.memberInfo, editedBoardMember, editedMemberType]);

    const handlePatchMemberContactInfo = useCallback(async (
        name: string,
        email: string,
        phone: string,
    ) => {
        let request: PatchMemberRequest = { modifiedBy: state.user!.memberId };
        if (name === '') {
            request = {
                firstName: props.memberInfo.firstName,
                lastName: props.memberInfo.lastName,
                ...request,
            };
        } else {
            const nameSplit = name?.split(' ');
            request = {
                firstName: nameSplit[0],
                lastName: nameSplit[1],
                ...request,
            };
        }
        if (email === '') {
            request = {
                email: props.memberInfo.email,
                ...request,
            };
        } else {
            request = {
                email,
                ...request,
            };
        }
        if (phone === '') {
            request = {
                phoneNumber: props.memberInfo.phoneNumber,
                ...request,
            };
        } else {
            request = {
                phoneNumber: phone,
                ...request,
            };
        }

        const updatedMember = await updateMember(state.token, props.memberInfo.memberId, request);
        if ('reason' in updatedMember) {
            setError(`error patching contact info: ${updatedMember.reason}`);
            return props.memberInfo;
        }
        return updatedMember;
    }, [state, props.memberInfo]);

    useEffect(() => {
        async function setModalData() {
            setSelectedMember(props.memberInfo);
            setEditedMemberType(props.memberInfo.memberType);
            const familyReponse = await getMembersByMembership(state.token, props.memberInfo.membershipId);
            setFamily(familyReponse);
            const bikeResponse = await getBikeList(state.token, props.memberInfo.membershipId);
            if ('reason' in bikeResponse) {
                setError(`error fetching bikes: ${bikeResponse.reason}`);
            } else {
                setBikes(bikeResponse);
            }
            if (state.user?.memberType === 'Admin') {
                const boardRoleData = await getBoardRoles(state.token);
                if ('reason' in boardRoleData) {
                    setError(`error loading board roles: ${boardRoleData.reason}`);
                } else {
                    setBoardRoles(boardRoleData);
                }
            }
            if (props.memberInfo.memberType.includes('Board Member')) {
                setIsBoard(true);
            } else {
                setIsBoard(false);
            }
        }
        setModalData();
    }, [props.memberInfo]);

    return (
        <Modal
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
                    { error !== '' && ({ error }) }
                    {
                        selectedMember && bikes && (
                            <SimpleGrid columns={[1, null, 2]} spacing={4}>
                                <VStack borderRightWidth={1} borderRightColor="light-grey" align="left">
                                    <HStack>
                                        <Text textAlign="left" fontSize="3xl" fontWeight="bold">Contact Info</Text>
                                        {
                                            state.user?.memberType === 'Admin' && (
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
                                                                setSelectedMember(await handlePatchMemberContactInfo(editedName, editedEmail, editedPhone));
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
                                    </HStack>
                                    <Text textAlign="left" fontSize="1xl" fontWeight="bold">Members</Text>
                                    <UnorderedList pl={10}>
                                        {
                                            family && _.map(family, (member) => (

                                                member.memberId === state.user!.memberId ? <ListItem key={member.memberId}>{`${member.firstName} ${member.lastName} (you)`}</ListItem>
                                                    : <ListItem key={member.memberId}>{`${member.firstName} ${member.lastName}`}</ListItem>
                                            ))
                                        }
                                    </UnorderedList>
                                    <Text textAlign="left" fontSize="1xl" fontWeight="bold">Bikes</Text>
                                    <UnorderedList pl={10}>
                                        {
                                            bikes.map((bike) => (
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
                                            state.user?.memberType === 'Admin' && (
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
                                                            () => {
                                                                if (editedMemberType !== 'member') {
                                                                    setEditedMemberType('member');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={(editingMemberRole && editedMemberType === 'member') || (!editingMemberRole && props.memberInfo.memberType === 'Member') ? 'blue' : ''}
                                                    >
                                                        Member
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            () => {
                                                                if (editedMemberType !== 'admin') {
                                                                    setEditedMemberType('admin');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={(editingMemberRole && editedMemberType === 'admin') || (!editingMemberRole && props.memberInfo.memberType === 'Admin') ? 'blue' : ''}
                                                    >
                                                        Admin
                                                    </Button>
                                                    <Button
                                                        onClick={
                                                            () => {
                                                                if (editedMemberType !== 'board') {
                                                                    setEditedMemberType('board');
                                                                }
                                                            }
                                                        }
                                                        mr="-px"
                                                        backgroundColor={(editingMemberRole && editedMemberType === 'board') || (!editingMemberRole && isBoard) ? 'blue' : ''}
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
                                                    {
                                                        _.map(boardRoles, (role) => (
                                                            <option value={role.boardTypeId} key={role.boardTypeId}>{role.title}</option>
                                                        ))
                                                    }
                                                </Select>
                                                <Button
                                                    ml={10}
                                                    variant="outline"
                                                    size="xs"
                                                    color="green"
                                                    onClick={
                                                        async () => {
                                                            await handlePatchMemberType();
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
                                    {
                                        state.user?.memberType === 'Admin' && (
                                            <VStack align="left">
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
                                                        onClick={
                                                            () => {
                                                                navigateToCalendar();
                                                                // Sign in as the selected user (to sign them up for events), and store the original user as storedUser
                                                                update({ loggedIn: true, token: state.token, user: selectedMember, storedUser: state.user });
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
                                                        onClick={
                                                            async () => {
                                                                const res = await deactivateMember();
                                                                toast({
                                                                    variant: 'subtle',
                                                                    title: res ? 'Member Deactivated.' : 'Action Failed',
                                                                    status: res ? 'success' : 'error',
                                                                    duration: 3000,
                                                                    isClosable: true,
                                                                });
                                                            }
                                                        }
                                                    >
                                                        De-Activate Member
                                                    </Button>
                                                </HStack>
                                                {/* <Button
                                                    textDecoration="underline"
                                                    color="orange"
                                                    variant="ghost"
                                                    onClick={
                                                        () => {

                                                        }
                                                    }
                                                >
                                                    Reset Password
                                                </Button> */}
                                            </VStack>
                                        )
                                    }
                                </VStack>
                            </SimpleGrid>
                        )
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
