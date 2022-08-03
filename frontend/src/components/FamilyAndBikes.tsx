import React, { useContext, useEffect, useState } from 'react';
import {
    Heading,
    VStack,
    HStack,
    Divider,
    SimpleGrid,
    Button,
    UnorderedList,
    ListItem,
    useDisclosure,
} from '@chakra-ui/react';
import { GetMemberListResponse, Member } from '../../../src/typedefs/member';
import { Bike, GetBikeListResponse } from '../../../src/typedefs/bike';
import DeleteAlert from './DeleteAlert';
import EditBikesModal from './EditBikeModal';
import AddFamilyModal from './modals/AddFamilyModal';
import AddBikeModal from './AddBikeModal';
import { updateMember } from '../controller/member';
import { UserContext } from '../contexts/UserContext';
import { createBike, deleteBike, getBikeList, updateBike } from '../controller/bike';

interface cardProps {
    memberFamily: GetMemberListResponse,
    memberBikes: GetBikeListResponse,
    admin: boolean
}

export default function GeneralInfo(props: cardProps) {
    const { state } = useContext(UserContext);
    const { onClose: onRemoveFamilyClose, isOpen: isRemoveFamilyOpen, onOpen: onRemoveFamilyOpen } = useDisclosure();
    const { onClose: onAddFamilyClose, isOpen: isAddFamilyOpen, onOpen: onAddFamilyOpen } = useDisclosure();

    const { onClose: onRemoveBikeClose, isOpen: isRemoveBikeOpen, onOpen: onRemoveBikeOpen } = useDisclosure();
    const { onClose: onEditBikeClose, isOpen: isEditBikeOpen, onOpen: onEditBikeOpen } = useDisclosure();
    const { onClose: onAddBikeClose, isOpen: isAddBikeOpen, onOpen: onAddBikeOpen } = useDisclosure();

    const [memberFamily, setMemberFamily] = useState<GetMemberListResponse>([]);
    const [memberBikes, setMemberBikes] = useState<GetBikeListResponse>([]);

    const [memberToRemove, setMemberToRemove] = useState<Member>();
    const [bikeToRemove, setBikeToRemove] = useState<Bike>();
    const [bikeToEdit, setBikeToEdit] = useState<Bike>();

    async function refreshBikeList() {
        const newBikeList = await getBikeList(state.token, state?.user?.membershipId);
        setMemberBikes(newBikeList);
    }

    async function removeFamilyMember() {
        if (memberToRemove !== undefined && state.user !== undefined) {
            await updateMember(
                state.token,
                memberToRemove.memberId,
                { active: false, modifiedBy: state.user.memberId },
            );
        }
    }

    async function removeBike() {
        if (bikeToRemove !== undefined && state.user !== undefined) {
            await deleteBike(state.token, bikeToRemove.bikeId);
        }
        await refreshBikeList();
    }

    async function editBike(editedBike: Bike, bikeYear: string, bikeMake: string, bikeModel: string) {
        await updateBike(
            state.token,
            editedBike.bikeId,
            { year: bikeYear, make: bikeMake, model: bikeModel },
        );
        await refreshBikeList();
    }

    async function addBike(newYear: string, newMake: string, newModel: string) {
        if (state.user !== undefined) {
            await createBike(
                state.token,
                { year: newYear, make: newMake, model: newModel, membershipId: state.user.membershipId },
            );
        }
        await refreshBikeList();
    }

    useEffect(() => {
        async function setMemberData() {
            setMemberFamily(props.memberFamily);
            setMemberBikes(props.memberBikes);
        }
        setMemberData();
    }, [props.memberFamily, props.memberBikes]);

    return (
        <SimpleGrid columns={1}>
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
                                onClick={
                                    () => {
                                        onAddFamilyOpen();
                                    }
                                }
                            >
                                Add
                            </Button>
                        )
                    }
                </HStack>
                {
                    memberFamily && (
                        <UnorderedList pt={10} spacing={2}>
                            {
                                (memberFamily as Member[]).map((member) => (
                                    <HStack>
                                        <ListItem
                                            fontSize="xl"
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
                                onClick={
                                    () => {
                                        onAddBikeOpen();
                                    }
                                }
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
                                (memberBikes as Bike[]).map((bike) => (
                                    <HStack>
                                        <ListItem
                                            fontSize="xl"
                                        >
                                            {` ${bike.year} ${bike.make} ${bike.model}`}
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
            {
                isAddFamilyOpen && (
                    <AddFamilyModal
                        isOpen={isAddFamilyOpen}
                        onClose={onAddFamilyClose}
                        membershipAdmin={state.user}
                        token={state.token}
                    />
                )
            }
            {
                isAddBikeOpen && (
                    <AddBikeModal
                        isOpen={isAddBikeOpen}
                        onClose={onAddBikeClose}
                        // eslint-disable-next-line react/jsx-no-bind
                        addBike={addBike}
                    />
                )
            }
        </SimpleGrid>
    );
}
