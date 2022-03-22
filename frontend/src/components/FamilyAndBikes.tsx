import React, { useEffect, useState } from 'react';
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
import { Member } from '../../../src/typedefs/member';
import { Bike } from '../../../src/typedefs/bike';
import DeleteAlert from './DeleteAlert';
import EditBikesModal from './EditBikeModal';
import AddFamilyModal from './AddFamilyModal';
import AddBikeModal from './AddBikeModal';

interface cardProps {
    memberFamily: Member[],
    memberBikes: Bike[],
    admin: Boolean
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

    function addBike(year: string, make: string, model: string) {
        // call controller to add bike
        // const newBike = addBike(memberShipId, year, make, model)
        // if successful
        const newBike: Bike = {
            bikeId: 3,
            year,
            make,
            model,
            membershipAdmin: 'me',
        };
        setMemberBikes(memberBikes.concat(newBike));
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
                                memberBikes.map((bike) => (
                                    <HStack>
                                        <ListItem
                                            ml={10}
                                            fontSize="3xl"
                                            width={375}
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
            {
                isAddFamilyOpen && (
                    <AddFamilyModal
                        isOpen={isAddFamilyOpen}
                        onClose={onAddFamilyClose}
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
