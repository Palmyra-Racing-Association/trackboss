import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Button,
    Divider,
    Heading,
    ModalFooter,
    Text,
    VStack,
    Input,

} from '@chakra-ui/react';
import { Bike } from '../../../src/typedefs/bike';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  bikeToEdit: Bike,
  // editBike: void,
}

export default function EditBikesModal(props: modalProps) {
    const [bike, setBike] = useState<Bike>();

    const [bikeYear, setBikeYear] = useState<string>();
    const [bikeMake, setBikeMake] = useState<string>();
    const [bikeModel, setBikeModel] = useState<string>();

    const handleEditedBikeYear = (event: { target: { value: any; }; }) => setBikeYear(event.target.value);
    const handleEditedBikeMake = (event: { target: { value: any; }; }) => setBikeMake(event.target.value);
    const handleEditedBikeModel = (event: { target: { value: any; }; }) => setBikeModel(event.target.value);

    useEffect(() => {
        async function setState() {
            setBike(props.bikeToEdit);
        }
        setState();
    }, [props.bikeToEdit]);

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading pl={2} pr={2} textAlign="center">
                    Edit this bike
                </Heading>
                <Text>
                    Current Bike Info:
                    {' '}
                    {`${bike?.year} ${bike?.make} ${bike?.model}`}
                </Text>
                <Divider mb={5} />
                <ModalCloseButton />
                <VStack align="left">
                    <Input
                        placeholder="Bike year"
                        value={bikeYear}
                        onChange={handleEditedBikeYear}
                        size="xs"
                    />
                    <Input
                        placeholder="Bike Make"
                        value={bikeMake}
                        onChange={handleEditedBikeMake}
                        size="xs"
                    />
                    <Input
                        placeholder="Bike Model"
                        value={bikeModel}
                        onChange={handleEditedBikeModel}
                        size="xs"
                    />
                </VStack>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="sm"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="sm"
                        onClick={
                            () => {
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
