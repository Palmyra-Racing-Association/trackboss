/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Box,
    Center,
    Text,
    Heading,
    VStack,
    HStack,
    Divider,
    SimpleGrid,
    Button,
    Input,
} from '@chakra-ui/react';
import { Member } from '../../../src/typedefs/member';

interface cardProps {
    user: Member,
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
        membershipId: 1,
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
        dateJoined: 'August 12, 2006',
        address: '',
        city: '',
        state: '',
        zip: '',
        lastModifiedDate: '',
        lastModifiedBy: '',
    };

    return updatedMember;
}

export default function GeneralInfo(props: cardProps) {
    const [memberInfo, setMemberInfo] = useState<Member>();
    const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('');
    const [editedEmail, setEditedEmail] = useState<string>('');
    const [editedPhone, setEditedPhone] = useState<string>('');

    const handleEditedNameChange = (event: { target: { value: any; }; }) => setEditedName(event.target.value);
    const handleEditedEmailChange = (event: { target: { value: any; }; }) => setEditedEmail(event.target.value);
    const handleEditedPhoneChange = (event: { target: { value: any; }; }) => setEditedPhone(event.target.value);

    useEffect(() => {
        async function setMemberData() {
            setMemberInfo(props.user);
        }
        setMemberData();
    }, [props.user]);

    return (
        <VStack mt={25}>
            <HStack>
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
                                                setMemberInfo(await handlePatchMemberContactInfo(memberInfo, editedName, editedEmail, editedPhone));
                                                setEditingMemberInfo(false);
                                            }
                                        }
                                    >
                                        Save
                                    </Button>
                                </VStack>
                            ) : (
                                <VStack ml="-80px" align="left">
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
