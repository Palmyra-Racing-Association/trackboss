import React, { useEffect, useState, useContext } from 'react';
import {
    Text,
    Heading,
    VStack,
    HStack,
    Divider,
    SimpleGrid,
    Button,
    Input,
} from '@chakra-ui/react';
import { Member, PatchMemberRequest } from '../../../src/typedefs/member';
import { updateMember } from '../controller/member';
import { UserContext } from '../contexts/UserContext';

interface cardProps {
    user: Member,
}

export default function GeneralInfo(props: cardProps) {
    const { state, update } = useContext(UserContext);
    const [memberInfo, setMemberInfo] = useState<Member>();
    const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedPhone, setEditedPhone] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleEditedNameChange = (event: { target: { value: any; }; }) => setEditedName(event.target.value);
    const handleEditedEmailChange = (event: { target: { value: any; }; }) => setEditedEmail(event.target.value);
    const handleEditedPhoneChange = (event: { target: { value: any; }; }) => setEditedPhone(event.target.value);

    async function handlePatchMemberContactInfo(
        memberPatchInfo: Member,
        name: string | undefined,
        email: string | undefined,
        phone: string | undefined,
    ) {
        const nameArray = name?.split(' ');
        if (nameArray && state.user) {
            const first = nameArray[0];
            const last = nameArray[1];
            const patch: PatchMemberRequest = {
                membershipId: memberPatchInfo.membershipId,
                uuid: memberPatchInfo.uuid,
                memberTypeId: memberPatchInfo.memberTypeId,
                firstName: first || memberPatchInfo.firstName,
                lastName: last || memberPatchInfo.lastName,
                phoneNumber: phone || memberPatchInfo.phoneNumber,
                occupation: memberPatchInfo.occupation,
                email: email || memberPatchInfo.email,
                birthdate: memberPatchInfo.birthdate,
                dateJoined: memberPatchInfo.dateJoined,
                modifiedBy: memberPatchInfo.memberId,
            };

            const res = await updateMember(state.token, state.user.memberId, patch);
            if ('reason' in res) {
                setError(res.reason);
            } else {
                update({ loggedIn: true, token: state.token, user: res, storedUser: undefined });
                setMemberInfo(res);
            }
        }
        return undefined;
    }

    useEffect(() => {
        async function setMemberData() {
            setMemberInfo(props.user);
        }
        setMemberData();
    }, [props.user]);

    return (
        <VStack mt={25}>
            <HStack>
                { error !== '' && ({ error })}
                <Heading>General Information</Heading>
                {
                    props.user.memberType === 'Admin' && (
                        <Button
                            mr={400}
                            textDecoration="underline"
                            color="orange"
                            variant="ghost"
                            size="lg"
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
            <Divider />
            {
                memberInfo && (
                    <SimpleGrid pt={10} columns={2}>
                        <VStack spacing={2} align="left">
                            <Text fontSize="3xl" fontWeight="bold">Name:</Text>
                            <Text fontSize="3xl" fontWeight="bold">Email:</Text>
                            <Text fontSize="3xl" fontWeight="bold">Phone:</Text>
                            <Text fontSize="3xl" fontWeight="bold">Joined:</Text>
                        </VStack>
                        {
                            editingMemberInfo ? (
                                <VStack mt={1.5} ml="-50px" align="left" spacing={3}>
                                    <Input
                                        placeholder={`${memberInfo.firstName} ${memberInfo.lastName}`}
                                        value={editedName}
                                        onChange={handleEditedNameChange}
                                        size="md"
                                    />
                                    <Input
                                        placeholder={memberInfo.email}
                                        value={editedEmail}
                                        onChange={handleEditedEmailChange}
                                        size="md"
                                    />
                                    <Input
                                        placeholder={memberInfo.phoneNumber}
                                        value={editedPhone}
                                        onChange={handleEditedPhoneChange}
                                        size="md"
                                    />
                                    <Text fontSize="3xl">{memberInfo.dateJoined}</Text>
                                    <Button
                                        ml={10}
                                        variant="outline"
                                        size="md"
                                        color="green"
                                        onClick={
                                            async () => {
                                                // eslint-disable-next-line max-len
                                                await handlePatchMemberContactInfo(memberInfo, editedName, editedEmail, editedPhone);
                                                setEditingMemberInfo(false);
                                            }
                                        }
                                    >
                                        Save
                                    </Button>
                                </VStack>
                            ) : (
                                <VStack ml="-70px" align="left">
                                    <Text fontSize="3xl">
                                        {`${memberInfo.firstName} ${memberInfo.lastName}`}
                                    </Text>
                                    <Text fontSize="3xl">{memberInfo.email}</Text>
                                    <Text fontSize="3xl">{memberInfo.phoneNumber}</Text>
                                    <Text fontSize="3xl">{memberInfo.dateJoined}</Text>
                                </VStack>
                            )
                        }
                    </SimpleGrid>
                )
            }
        </VStack>
    );
}
