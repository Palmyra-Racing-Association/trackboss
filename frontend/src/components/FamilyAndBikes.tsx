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
    OrderedList,
    UnorderedList,
    ListItem,
    useDisclosure,
} from '@chakra-ui/react';
import { FaBitbucket } from 'react-icons/fa';
import { Member } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import bikeHandlers from '../mocks/bikeHandlers';
import DeleteAlert from './DeleteAlert';
import EditBikesModal from './EditBikesModal';

interface cardProps {
    // member: Member,
    memberFamily: Member[],
    memberBikes: Bike[],
    admin: boolean,
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
    const { onClose: onRemoveFamilyClose, isOpen: isRemoveFamilyOpen, onOpen: onRemoveFamilyOpen } = useDisclosure();
    const { onClose: onAddFamilyClose, isOpen: isAddFamilyOpen, onOpen: onAddFamilyOpen } = useDisclosure();

    const { onClose: onRemoveBikeClose, isOpen: isRemoveBikeOpen, onOpen: onRemoveBikeOpen } = useDisclosure();
    const { onClose: onEditBikeClose, isOpen: isEditBikeOpen, onOpen: onEditBikeOpen } = useDisclosure();
    const { onClose: onAddBikeClose, isOpen: isAddBikeOpen, onOpen: onAddBikeOpen } = useDisclosure();

    const [memberFamily, setMemberFamily] = useState<Member[]>([]);
    const [memberBikes, setMemberBikes] = useState<Bike[]>([]);

    const [memberToRemove, setMemberToRemove] = useState<Member>();
    const [bikeToRemove, setBikeToRemove] = useState<Bike>();
    const [bikeToEdit, setBikeToEdit] = useState<Bike>();

    // const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);
    // const [editingMemberInfo, setEditingMemberInfo] = useState<boolean>(false);

    // const handleEditedNameChange = (event: { target: { value: any; }; }) => setEditedName(event.target.value);
    // const handleEditedEmailChange = (event: { target: { value: any; }; }) => setEditedEmail(event.target.value);
    // const handleEditedPhoneChange = (event: { target: { value: any; }; }) => setEditedPhone(event.target.value);

    function removeFamilyMember() {
        // call controller and await response, if successful...
        if (memberToRemove) {
            const newMemberFamily = memberFamily.filter((m) => m.memberId !== memberToRemove.memberId);
            setMemberFamily(newMemberFamily);
        }
    }

    function removeBike() {
        // call controller and await response, if successful...
        if (bikeToRemove) {
            const newMemberBikes = memberBikes.filter((b) => b.bikeId !== bikeToRemove?.bikeId);
            setMemberBikes(newMemberBikes);
        }
    }

    function editBike(editedBike: Bike, bikeYear: string, bikeMake: string, bikeModel: string) {
        // call controller and await response, if successful...
        const index = memberBikes.indexOf(editedBike);
        memberBikes[index].year = bikeYear;
        memberBikes[index].make = bikeMake;
        memberBikes[index].model = bikeModel;
        setMemberBikes(memberBikes);
    }

    useEffect(() => {
        async function setMemberData() {
            setMemberFamily(props.memberFamily);
            setMemberBikes(props.memberBikes);
        }
        setMemberData();
    }, [props.memberFamily, props.memberBikes]);

    return (
        <SimpleGrid columns={2}>
            <VStack mt={25} borderRightWidth={0.5} borderRightColor="lightgrey">
                <HStack>
                    <Heading>Family</Heading>
                    {
                        props.admin && (
                            <Button
                                mr={400}
                                textDecoration="underline"
                                color="orange"
                                variant="ghost"
                                size="lg"
                            >
                                Add
                            </Button>
                        )
                    }
                </HStack>
                <Divider />
                {
                    memberFamily && (
                        <UnorderedList pt={10} spacing={2}>
                            {
                                memberFamily.map((member) => (
                                    <HStack>
                                        <ListItem
                                            fontSize="3xl"
                                        >
                                            {` ${member.firstName} ${member.lastName}`}
                                        </ListItem>
                                        {
                                            props.admin && (
                                                <Button
                                                    textDecoration="underline"
                                                    color="red"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={
                                                        () => {
                                                            setMemberToRemove(member);
                                                            onRemoveFamilyOpen();
                                                        }
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            )
                                        }
                                    </HStack>
                                ))
                            }
                        </UnorderedList>
                    )
                }
            </VStack>
            <VStack mt={25}>
                <HStack>
                    <Heading>Bikes</Heading>
                    {
                        props.admin && (
                            <Button
                                textDecoration="underline"
                                color="orange"
                                variant="ghost"
                                size="lg"
                            >
                                Add
                            </Button>
                        )
                    }
                </HStack>
                <Divider />
                {
                    memberBikes && (
                        <UnorderedList pt={10} spacing={2}>
                            {
                                memberBikes.map((bike) => (
                                    <HStack>
                                        <ListItem
                                            ml={10}
                                            fontSize="3xl"
                                            width={400}
                                        >
                                            {` ${bike.year}, ${bike.make} ${bike.model}`}
                                        </ListItem>
                                        {
                                            props.admin && (
                                                <Button
                                                    textDecoration="underline"
                                                    color="red"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={
                                                        () => {
                                                            setBikeToRemove(bike);
                                                            onRemoveBikeOpen();
                                                        }
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            )
                                        }
                                        {
                                            props.admin && (
                                                <Button
                                                    textDecoration="underline"
                                                    color="orange"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={
                                                        () => {
                                                            setBikeToEdit(bike);
                                                            onEditBikeOpen();
                                                        }
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                            )
                                        }
                                    </HStack>
                                ))
                            }
                        </UnorderedList>
                    )
                }
            </VStack>
            {
                isRemoveFamilyOpen && (
                    <DeleteAlert
                        isOpen={isRemoveFamilyOpen}
                        onClose={onRemoveFamilyClose}
                        // eslint-disable-next-line react/jsx-no-bind
                        removeMethod={removeFamilyMember}
                    />
                )
            }
            {
                isRemoveBikeOpen && (
                    <DeleteAlert
                        isOpen={isRemoveBikeOpen}
                        onClose={onRemoveBikeClose}
                        // eslint-disable-next-line react/jsx-no-bind
                        removeMethod={removeBike}
                    />
                )
            }
            {
                isEditBikeOpen && bikeToEdit && (
                    <EditBikesModal
                        isOpen={isEditBikeOpen}
                        onClose={onEditBikeClose}
                        bikeToEdit={bikeToEdit}
                        // eslint-disable-next-line react/jsx-no-bind
                        editBike={editBike}
                    />
                )
            }
        </SimpleGrid>
    );
}
