import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    Button,
    Heading,
    ModalFooter,
    Divider,
    Box,
    Input,
    Text,
} from '@chakra-ui/react';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import WrappedSwitchInput from '../input/WrappedSwitchInput';
import { Member, PostNewMemberRequest } from '../../../../src/typedefs/member';

import 'react-date-picker/dist/DatePicker.css';
import '../../css/date-picker.css';

interface modalProps {
  isOpen: boolean,
  membershipAdmin: Member | undefined,
  onClose: () => void,
}

export default function AddFamilyModal(props: modalProps) {
    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [allowOnlineAccess, setAllowOnlineAccess] = useState<boolean>(true);
    const [birthDate, setBirthDate] = useState<Date>();

    return (
        <Modal isCentered size="xl" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Heading pl={2} pr={2} textAlign="center">
                    Add family member
                </Heading>
                <Divider />
                <Box width={300}>
                    <Box m={3}>
                        <Input
                            placeholder="First Name"
                            value={firstName}
                            onChange={
                                (e) => {
                                    setFirstName(e.target.value);
                                }
                            }
                        />
                    </Box>
                    <Box m={3}>
                        <Input
                            placeholder="Last Name"
                            value={lastName}
                            onChange={
                                (e) => {
                                    setLastName(e.target.value);
                                }
                            }
                        />
                    </Box>
                    <Box m={3}>
                        <Text>Birth date</Text>
                        <DatePicker
                            minDate={moment().subtract(100, 'years').toDate()}
                            maxDate={moment().subtract(1, 'months').toDate()}
                            onChange={
                                (date: Date) => {
                                    setBirthDate(date);
                                }
                            }
                            onCalendarClose={() => setBirthDate(birthDate)}
                            value={birthDate}
                        />
                    </Box>
                    <Box m={3}>
                        <Input
                            placeholder="email (if applicable)"
                            value={email}
                            onChange={
                                (e) => {
                                    setEmail(e.target.value);
                                }
                            }
                        />
                    </Box>
                    <Box m={3}>
                        <WrappedSwitchInput
                            maxWidth={300}
                            wrapperText="Allow online access?"
                            defaultChecked={allowOnlineAccess}
                            onSwitchChange={setAllowOnlineAccess}
                        />
                    </Box>
                </Box>
                <ModalFooter>
                    <Button
                        color="black"
                        variant="ghost"
                        mr={3}
                        size="lg"
                        onClick={
                            () => {
                                props.onClose();
                            }
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        color="green"
                        variant="ghost"
                        mr={3}
                        size="lg"
                        disabled={
                            (!firstName) ||
                            (!lastName) ||
                            (!birthDate) ||
                            (allowOnlineAccess && !email)
                        }
                        onClick={
                            async () => {
                                const familyMemberAdd : PostNewMemberRequest = {
                                    membershipId: props.membershipAdmin?.membershipId,
                                    // magic numberism - this is 'Member'.  anyone created this way will be a member
                                    // created by a membership admin.
                                    memberTypeId: 9,
                                    firstName,
                                    lastName,
                                    occupation: '',
                                    email: '',
                                    birthdate: birthDate?.toLocaleDateString('en-CA'),
                                    dateJoined: props.membershipAdmin?.dateJoined,
                                    modifiedBy: props.membershipAdmin?.memberId || 0,
                                };
                                if (allowOnlineAccess) {
                                    familyMemberAdd.email = email;
                                }
                                // eslint-disable-next-line no-alert
                                alert('Save coming soon!');
                                // eslint-disable-next-line no-console
                                console.log(JSON.stringify(familyMemberAdd));
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
