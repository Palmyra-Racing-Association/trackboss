import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalCloseButton,
    Button,
    Divider,
    Heading,
    ModalFooter,
    VStack,
    Input,

} from '@chakra-ui/react';

interface modalProps {
  isOpen: boolean,
  onClose: () => void,
  // eslint-disable-next-line no-unused-vars
  addBike: (year: string, make: string, model: string) => void,
}

export default function EditBikesModal(props: modalProps) {
    const [bikeYear, setBikeYear] = useState<string>('');
    const [bikeMake, setBikeMake] = useState<string>('');
    const [bikeModel, setBikeModel] = useState<string>('');

    const handleEditedBikeYear = (event: { target: { value: any; }; }) => setBikeYear(event.target.value);
    const handleEditedBikeMake = (event: { target: { value: any; }; }) => setBikeMake(event.target.value);
    const handleEditedBikeModel = (event: { target: { value: any; }; }) => setBikeModel(event.target.value);

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading pl={2} pr={2} textAlign="center">
                    Add New Bike
                </Heading>
                <Divider mb={5} />
                <ModalCloseButton />
                <VStack
                    align="left"
                    mr={5}
                    ml={5}
                >
                    <Input
                        variant="outline"
                        placeholder="Bike year"
                        value={bikeYear}
                        onChange={handleEditedBikeYear}
                        size="md"
                    />
                    <Input
                        variant="outline"
                        placeholder="Bike Make"
                        value={bikeMake}
                        onChange={handleEditedBikeMake}
                        size="md"
                    />
                    <Input
                        variant="outline"
                        placeholder="Bike Model"
                        value={bikeModel}
                        onChange={handleEditedBikeModel}
                        size="md"
                    />
                </VStack>
                <ModalFooter>
                    <Button
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Close
                    </Button>
                    <Button
                        color="green"
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.addBike(bikeYear, bikeMake, bikeModel);
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
