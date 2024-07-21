/* eslint-disable react/no-unused-prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react';
import {
    Button, Divider, Grid, GridItem, Heading, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalOverlay, Text,
    Textarea, useDisclosure,
} from '@chakra-ui/react';
import { isEmail, isMobilePhone } from 'validator';
import PhoneInput from 'react-phone-number-input/input';

import { PaidLabor } from '../../../../src/typedefs/paidLabor';
import { createPaidLabor, updatePaidLabor } from '../../controller/paidLabor';

import { UserContext } from '../../contexts/UserContext';

interface PaidLaborModalProps {
    laborer?: PaidLabor,
    isOpen: boolean,
    onClose: () => void,
    editMode: boolean,
}

export default function PaidLaborModal(props: PaidLaborModalProps) {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [businessName, setBusinessName] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isBusiness, setIsBusiness] = useState<boolean>();
    const [dirty, setDirty] = useState<boolean>();
    const [phoneValid, setPhoneValid] = useState<boolean>();
    const [emailValid, setEmailValid] = useState<boolean>();

    const chakraStyleForNonChakra = {
        width: '70%',
        font: 'Russo One',
        padding: '12px 20px',
        margin: '6px 0;',
        display: 'inline-block',
        border: '1px solid #ccc',
        borderRadius: '0.375rem',
    };

    const { laborer, editMode } = props;

    const { state } = useContext(UserContext);

    useEffect(() => {
        setPhone(props.laborer?.phoneNumber);
        setEmail(props.laborer?.email || '');
    });

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading
                    textAlign="center"
                >
                    Update Paid Laborer
                </Heading>
                <Divider />
                <ModalBody>
                    <Grid
                        templateRows="repeat(3, 1fr)"
                        templateColumns="repeat(2, 1fr)"
                        columnGap={1}
                        rowGap={1}
                    >
                        <GridItem colSpan={1}>
                            <Text>First Name</Text>
                            <Input
                                defaultValue={laborer?.firstName}
                                value={firstName}
                                size="md"
                                onChange={
                                    (e) => {
                                        setDirty(true);
                                        setFirstName(e.target.value);
                                    }
                                }
                            />
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Text>Last Name</Text>
                            <Input
                                defaultValue={laborer?.lastName}
                                value={lastName}
                                size="md"
                                onChange={
                                    (e) => {
                                        setDirty(true);
                                        setLastName(e.target.value);
                                    }
                                }
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>Business Name</Text>
                            <Input
                                defaultValue={laborer?.businessName}
                                value={businessName}
                                size="md"
                                onChange={
                                    (e) => {
                                        setDirty(true);
                                        setBusinessName(e.target.value);
                                    }
                                }
                            />
                        </GridItem>
                        <GridItem colSpan={1}>
                            <Text>Phone</Text>
                            <Text size="xs">
                                Phone must be ten digits and include area code. Number formatted automatically.
                            </Text>
                            <PhoneInput
                                autocomplete="new-password"
                                style={chakraStyleForNonChakra}
                                defaultCountry="US"
                                value={phone}
                                onChange={setPhone}
                            />
                        </GridItem>
                        <GridItem colSpan={2}>
                            <Text>email</Text>
                            <Input
                                size="md"
                                value={email}
                                onChange={
                                    (e) => {
                                        const typedEmail = e.target.value;
                                        setEmailValid(isEmail(typedEmail));
                                        setEmail(typedEmail);
                                        setDirty(emailValid);
                                    }
                                }
                            />
                        </GridItem>
                    </Grid>
                </ModalBody>
                <ModalFooter>
                    <Button
                        backgroundColor="orange"
                        color="white"
                        onClick={
                            async () => {
                                const laborerEntry : PaidLabor = {
                                    firstName,
                                    lastName,
                                    businessName,
                                    phoneNumber: phone,
                                    email,
                                };
                                if (editMode) {
                                    // we are editing an existing entry so PUT it
                                    laborerEntry.paidLaborId = laborer?.paidLaborId || 0;
                                    await updatePaidLabor(state.token, laborerEntry);
                                } else {
                                    // It's new, so add it to the back end, yay!
                                    await createPaidLabor(state.token, laborerEntry);
                                }
                                alert(JSON.stringify(laborerEntry));

                                props.onClose();
                            }
                        }
                    >
                        { editMode ? 'Update' : 'Save' }
                    </Button>
                    <Button
                        backgroundColor="white"
                        onClick={props.onClose}
                    >
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>

        </Modal>
    );
}
PaidLaborModal.defaultProps = {
    laborer: {},
};
