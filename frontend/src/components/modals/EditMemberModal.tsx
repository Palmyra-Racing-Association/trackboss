/* eslint-disable no-unused-vars */
import React, { useContext, useState } from 'react';
import {
    Button, Grid, GridItem, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Text, useDisclosure, useToast,
} from '@chakra-ui/react';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone from 'validator/es/lib/isMobilePhone';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import Select from 'react-select';

import { UserContext } from '../../contexts/UserContext';

import { Member, PatchMemberRequest } from '../../../../src/typedefs/member';
import { PatchMembershipRequest } from '../../../../src/typedefs/membership';

import { updateMember } from '../../controller/member';
import { updateMembership } from '../../controller/membership';

import MembershipTypeSelector from '../shared/MembershipTypeSelector';

interface EditMemberModalProps {
    member: Member,
    refreshMemberFunction: () => void,
    isFamilyMember?: boolean,
    hasEmail?: boolean,
}

// eslint-disable-next-line no-unused-vars
export default function EditMemberModal(props: EditMemberModalProps) {
    const selectedMember = props.member;
    const {
        isOpen,
        onOpen,
        onClose,
    } = useDisclosure();
    const toast = useToast();
    const [streetAddress, setStreetAddress] = useState<string>(selectedMember.address);
    const [city, setCity] = useState<string>(selectedMember.city);
    const [memberAddressState, setMemberAddressState] = useState<string>(selectedMember.state);
    const [zip, setZip] = useState<string>(selectedMember.zip);
    const [phoneNumber, setPhoneNumber] = useState<string>(selectedMember.phoneNumber);
    const [email, setEmail] = useState<string>(selectedMember.email);
    const [dirty, setDirty] = useState<boolean>(false);
    const [phoneValid, setPhoneValid] = useState<boolean>(isMobilePhone(phoneNumber, 'en-US'));
    const [emailValid, setEmailValid] = useState<boolean>(isEmail(email));
    const [birthdate, setBirthDate] = useState<Date>(moment(selectedMember.birthdate).toDate());
    const [membershipType, setMembershipType] = useState<number>(selectedMember.membershipTypeId);
    const [rowCount, setRowCount] = useState<number>(7);

    const { state, update } = useContext(UserContext);

    return (
        <>
            <Button
                textDecoration="underline"
                color="orange"
                variant="ghost"
                onClick={onOpen}
            >
                Edit
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                        {`Edit member info - ${selectedMember.firstName} ${props.member.lastName}`}
                    </ModalHeader>
                    <ModalBody>
                        <Grid
                            templateRows={`repeat(${rowCount}, 1fr)`}
                            templateColumns="repeat(2, 1fr)"
                            columnGap={2}
                            rowGap={2}
                        >
                            <GridItem colSpan={2} display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>Membership Type</Text>
                                <MembershipTypeSelector
                                    isAdmin={state.user?.memberType === 'Admin'}
                                    currentType={selectedMember.membershipType}
                                    setSelectedOption={
                                        (mt: number) => {
                                            setMembershipType(mt);
                                            setDirty(true);
                                        }
                                    }
                                />
                            </GridItem>
                            <GridItem colSpan={2}>
                                <Text>DOB</Text>
                                <DatePicker
                                    onChange={
                                        (date:any) => {
                                            setBirthDate(date);
                                            setDirty(true);
                                        }
                                    }
                                    value={birthdate}
                                    required
                                    maxDate={new Date()}
                                />
                            </GridItem>
                            <GridItem colSpan={2} display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>Street Address</Text>
                                <Input
                                    value={streetAddress}
                                    size="md"
                                    onChange={
                                        (e) => {
                                            setDirty(true);
                                            setStreetAddress(e.target.value);
                                        }
                                    }
                                />
                            </GridItem>
                            <GridItem colSpan={1} display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>City</Text>
                                <Input
                                    value={city}
                                    size="md"
                                    onChange={
                                        (e) => {
                                            setDirty(true);
                                            setCity(e.target.value);
                                        }
                                    }
                                />
                            </GridItem>
                            <GridItem display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>State</Text>
                                <Input
                                    value={memberAddressState}
                                    size="md"
                                    onChange={
                                        (e) => {
                                            setDirty(true);
                                            setMemberAddressState(e.target.value);
                                        }
                                    }
                                />
                            </GridItem>
                            <GridItem display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>Zip</Text>
                                <Input
                                    value={zip}
                                    size="md"
                                    width="auto"
                                    onChange={
                                        (e) => {
                                            setDirty(true);
                                            setZip(e.target.value);
                                        }
                                    }
                                />
                            </GridItem>
                            <GridItem colSpan={2} display={props.hasEmail ? 'block' : 'none'}>
                                <Text>email (Changing this changes the login email too)</Text>
                                <Text color="red" size="xs" hidden={emailValid}>
                                    email must be a valid email address
                                </Text>
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
                            <GridItem colSpan={2} display={!props.isFamilyMember ? 'block' : 'none'}>
                                <Text>Phone</Text>
                                <Text color="red" size="xs" hidden={phoneValid}>
                                    Phone must be ten digits and include area code
                                </Text>
                                <Input
                                    value={phoneNumber}
                                    size="md"
                                    onChange={
                                        (e) => {
                                            const typedPhoneNumber = e.target.value;
                                            setPhoneValid(isMobilePhone(typedPhoneNumber, 'en-US'));
                                            setPhoneNumber(typedPhoneNumber);
                                            setDirty(phoneValid);
                                        }
                                    }
                                />
                            </GridItem>
                        </Grid>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            mr={4}
                            backgroundColor="orange"
                            disabled={!dirty}
                            color="white"
                            onClick={
                                async () => {
                                    selectedMember.address = streetAddress;
                                    selectedMember.city = city;
                                    selectedMember.state = memberAddressState;
                                    selectedMember.zip = zip;
                                    selectedMember.email = email;
                                    selectedMember.phoneNumber = phoneNumber;
                                    if (!phoneNumber.startsWith('+1')) {
                                        setPhoneNumber(`+1${phoneNumber}`);
                                    }
                                    const memberUpdate : PatchMemberRequest = {
                                        email,
                                        phoneNumber,
                                        birthdate: moment(birthdate).format('YYYY-MM-DD'),
                                        modifiedBy: state.user?.memberId || 0,
                                    };
                                    await updateMember(state.token, selectedMember.memberId, memberUpdate);
                                    const membershipUpdate: PatchMembershipRequest = {
                                        membershipTypeId: membershipType,
                                        address: streetAddress,
                                        city,
                                        state: memberAddressState,
                                        zip,
                                        modifiedBy: state.user?.memberId || 0,
                                    };
                                    await updateMembership(state.token, selectedMember.membershipId, membershipUpdate);
                                    props.refreshMemberFunction();
                                    toast({
                                        containerStyle: {
                                            background: 'orange',
                                        },
                                        // eslint-disable-next-line max-len
                                        title: 'Member info updated',
                                        description: `${JSON.stringify(selectedMember)}`,
                                        status: 'success',
                                        duration: 5000,
                                        isClosable: true,
                                    });
                                    onClose();
                                }
                            }
                        >
                            Save
                        </Button>
                        <Button backgroundColor="white" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
EditMemberModal.defaultProps = {
    isFamilyMember: false,
    hasEmail: true,
};
