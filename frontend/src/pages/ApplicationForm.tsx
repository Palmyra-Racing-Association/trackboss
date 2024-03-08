/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Box, Button, ChakraProvider, Divider, Image, Input, InputGroup, InputLeftAddon, NumberDecrementStepper,
    NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, SimpleGrid, Tag, Text, Textarea,
    useDisclosure,
} from '@chakra-ui/react';
import { BsTrash2 } from 'react-icons/bs';
import PhoneInput from 'react-phone-number-input/input';
import 'react-phone-number-input/style.css';
import { isEmail } from 'validator';
import Autocomplete from 'react-google-autocomplete';
import DatePicker from 'react-date-picker';
import moment from 'moment';
import _, { uniqueId } from 'lodash';

import theme from '../theme';

import { applicationExists } from '../controller/membershipApplication';
import { memberExistsByEmail } from '../controller/member';
import SimpleAlertModal from '../components/modals/SimpleAlertModal';

function ApplicationForm() {
    const chakraStyleForNonChakra = {
        width: '70%',
        font: 'Russo One',
        padding: '12px 20px',
        margin: '8px 0;',
        display: 'inline-block',
        border: '1px solid #ccc',
        borderRadius: '0.375rem',
    };
    const [season, setSeason] = useState<number>();

    const [firstName, setFirstName] = useState<string>();
    const [lastName, setLastName] = useState<string>();
    const [address, setAddress] = useState<string>();
    const [zipCode, setZipCode] = useState<string>();
    const [city, setCity] = useState<string>();
    const [state, setState] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [birthDate, setBirthDate] = useState<Date>();
    const [occupation, setOccupation] = useState<string>();
    const [referredBy, setReferredBy] = useState<string>();
    const [familyMemberCount, setFamilyMemberCount] = useState<number>(0);
    const [applicationJson, setApplicationJson] = useState<string>();
    const [fullName, setFullName] = useState<string>('');
    const [newFamilyFirst, setNewFamilyFirst] = useState<string>('');
    const [newFamilyLast, setNewFamilyLast] = useState<string>('');
    const [newFamilyDob, setNewFamilyDob] = useState<Date>();

    const [familyMembers, setFamilyMembers] = useState<any[]>([]);

    const [alertMsg, setAlertMsg] = useState<string>();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const eightteenYearsAgo = moment().subtract(18, 'years').toDate();

    useEffect(() => {
        const date = new Date();
        const month = date.getMonth();
        if (month >= 6) {
            setSeason(date.getFullYear() + 1);
        } else {
            setSeason(date.getFullYear());
        }
        document.title = `PRA application - ${season} season`;
    });

    const familyMemberList : any[] = [];

    for (let index = 0; index < familyMembers.length; index++) {
        const familyMemberComponent = (
            <>
                <Tag size="md" colorScheme="orange">{`Family member ${index + 1}`}</Tag>
                <SimpleGrid columns={{ sm: 2, md: 4 }} spacing={4} mb={2}>
                    <Input placeholder="First Name" value={familyMembers[index].firstName} disabled />
                    <Input placeholder="Last Name" value={familyMembers[index].lastName} disabled />
                    <DatePicker
                        required
                        minDate={moment().subtract(85, 'years').toDate()}
                        maxDate={new Date()}
                        value={familyMembers[index].dob}
                        disabled
                    />
                </SimpleGrid>
            </>
        );
        familyMemberList.push(familyMemberComponent);
    }

    return (
        <ChakraProvider theme={theme}>
            <Box
                mt={0}
                pt={0}
                ml={5}
                borderWidth="20 px"
                borderRadius="lg"
                width="75%"
                backgroundColor="white"
            >
                <SimpleGrid columns={2} maxWidth={800} m={5}>
                    <Box maxW={200}>
                        <Image width={200} height={90} src="logo192.png" />
                    </Box>
                    <Text fontSize="2xl">
                        {`Palmyra Racing Association Application - ${season} season`}
                    </Text>
                </SimpleGrid>
                <Box paddingBottom={5} m={5}>
                    <Text>
                        Please complete all sections. Note that when your application is accepted we will need payment,
                        waiver of liability, minor waivers, and health insurance information. We will also need names
                        and dates of birth for all family members.  We do not need any of
                        that at the time of application. The current year dues are $575 (subject to change).
                    </Text>
                </Box>
                <Box paddingBottom={5} m={5}>
                    <Text>
                        For ease of processing, we are only accepting applications online. If you need a paper
                        application, please contact us.
                    </Text>
                </Box>
                <SimpleGrid columns={{ sm: 1, md: 2 }} m={5}>
                    <Box m={2}>
                        <Text>First Name*</Text>
                        <Input
                            isRequired
                            value={firstName}
                            onChange={
                                (e) => {
                                    let nameValue = e.target.value;
                                    if (nameValue) {
                                        nameValue = nameValue.replace(/\s/g, '');
                                        nameValue = _.capitalize(nameValue);
                                        if (nameValue && lastName) {
                                            setFullName(`${firstName} ${lastName}`);
                                        }
                                    }
                                    setFirstName(nameValue);
                                }
                            }
                        />
                    </Box>
                    <Box m={2}>
                        <Text>Last Name*</Text>
                        <Input
                            isRequired
                            value={lastName}
                            onChange={
                                (e) => {
                                    let lastNameValue = e.target.value;
                                    if (lastNameValue) {
                                        lastNameValue = lastNameValue.replace(/\s/g, '');
                                        lastNameValue = _.capitalize(lastNameValue);
                                        if (lastNameValue && firstName) {
                                            setFullName(`${firstName} ${lastNameValue}`);
                                        }
                                    }
                                    setLastName(lastNameValue);
                                }
                            }
                        />
                    </Box>
                </SimpleGrid>
                <SimpleGrid m={5}>
                    <Box m={2}>
                        <Text>Street Address*</Text>
                        <Text fontSize="xs">
                            Please type your address as it will auto complete. We just need a street address - apartment
                            or unit numbers not required.
                        </Text>
                        <Autocomplete
                            inputAutocompleteValue="address"
                            style={chakraStyleForNonChakra}
                            apiKey="AIzaSyA8N7kdBhP-1M3Y393FNDL71-nWanO9lBI"
                            options={
                                {
                                    types: ['address'],
                                    componentRestrictions: { country: 'us' },
                                }
                            }
                            onPlaceSelected={
                                (place : any) => {
                                    let mapsStreetAddress = '';
                                    let mapsZipCode = '';
                                    place.address_components.forEach((component: any) => {
                                        const attributeShort = component.short_name;
                                        const attributeLong = component.long_name;
                                        const attributeType = component.types[0];
                                        switch (attributeType) {
                                            case 'street_number':
                                                mapsStreetAddress = attributeShort;
                                                break;
                                            case 'route':
                                                mapsStreetAddress = `${mapsStreetAddress} ${attributeLong}`;
                                                break;
                                            case 'locality':
                                                setCity(attributeShort);
                                                break;
                                            case 'administrative_area_level_1':
                                                setState(attributeShort);
                                                break;
                                            case 'postal_code':
                                                mapsZipCode = attributeShort;
                                                break;
                                            case 'postal_code_suffix':
                                                mapsZipCode = `${mapsZipCode}-${attributeShort}`;
                                                break;
                                            default:
                                                break;
                                        }
                                    });
                                    setAddress(mapsStreetAddress);
                                    setZipCode(mapsZipCode);
                                }
                            }
                        />
                    </Box>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} m={5}>
                    <Box m={2}>
                        <Text>Phone*</Text>
                        <Text fontSize="xs">You can just type the numbers - we handle all the rest!</Text>
                        <PhoneInput
                            autocomplete="new-password"
                            style={chakraStyleForNonChakra}
                            defaultCountry="US"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                        />
                    </Box>
                    <Box m={2}>
                        <Text>eMail*</Text>
                        <Text fontSize="xs">This is used for all communications regarding your application.</Text>
                        <Input
                            onChange={
                                async (e) => {
                                    const emailValue = e.target.value;
                                    setEmail(emailValue);
                                    if (isEmail(emailValue)) {
                                        const appExists = await applicationExists(emailValue);
                                        if (appExists.exists) {
                                            setAlertMsg(
                                                `We have an existing application for ${emailValue}.  Your
                                                information is stored; for further info please contact us!`,
                                            );
                                            setEmail('');
                                            e.target.value = '';
                                            onOpen();
                                        }
                                        const memberExists = await memberExistsByEmail(emailValue);
                                        if (memberExists.exists && emailValue) {
                                            setAlertMsg(
                                                `We have an existing membership for ${emailValue}.  There is
                                                no need to re-apply; you can renew annually using Trackboss.`,
                                            );
                                            setEmail('');
                                            e.target.value = '';
                                            onOpen();
                                        }
                                    }
                                }
                            }
                        />
                    </Box>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 3 }} m={5}>
                    <Box m={2}>
                        <Text>Date of Birth*</Text>
                        <Text fontSize="xs">Primary members MUST be over 18.</Text>
                        <DatePicker
                            defaultActiveStartDate={eightteenYearsAgo}
                            value={birthDate}
                            required
                            minDate={moment().subtract(85, 'years').toDate()}
                            maxDate={eightteenYearsAgo}
                            onChange={
                                (e : any) => {
                                    setBirthDate(e);
                                }
                            }
                        />
                    </Box>
                    <Box m={2}>
                        <Text>Occupation</Text>
                        <Text fontSize="xs">Knowing what you do you can help us help you.</Text>
                        <Input
                            value={occupation}
                            onChange={
                                (e) => {
                                    setOccupation(_.startCase(e.target.value));
                                }
                            }
                        />
                    </Box>
                    <Box m={2}>
                        <Text>Referred By</Text>
                        <Text fontSize="xs">This can be an existing, or former member of PRA.</Text>
                        <Input
                            value={referredBy}
                            onChange={
                                (e) => {
                                    setReferredBy(e.target.value);
                                }
                            }
                        />
                    </Box>
                </SimpleGrid>
                <SimpleGrid m={7}>
                    <Box maxWidth="75%">
                        <Text>Family members (besides you)</Text>
                        <Box mt={4}>
                            <SimpleGrid columns={{ sm: 2, md: 4 }} spacing={4} mb={2}>
                                <Input
                                    placeholder="First Name"
                                    value={newFamilyFirst}
                                    onChange={
                                        (e) => {
                                            let nameValue = e.target.value;
                                            nameValue = nameValue.replace(/\s/g, '');
                                            nameValue = _.capitalize(nameValue);
                                            e.target.value = nameValue;
                                            setNewFamilyFirst(e.target.value);
                                        }
                                    }
                                />
                                <Input
                                    placeholder="Last Name"
                                    value={newFamilyLast}
                                    onChange={
                                        (e) => {
                                            let nameValue = e.target.value;
                                            nameValue = nameValue.replace(/\s/g, '');
                                            nameValue = _.capitalize(nameValue);
                                            e.target.value = nameValue;
                                            setNewFamilyLast(e.target.value);
                                        }
                                    }
                                />
                                <DatePicker
                                    required
                                    minDate={moment().subtract(85, 'years').toDate()}
                                    maxDate={new Date()}
                                    value={newFamilyDob}
                                    onChange={
                                        (e : any) => {
                                            setNewFamilyDob(e);
                                        }
                                    }
                                />
                                <Button
                                    backgroundColor="orange.300"
                                    color="white"
                                    isDisabled={!newFamilyFirst || !newFamilyLast || !newFamilyDob}
                                    onClick={
                                        () => {
                                            setFamilyMembers(
                                                [
                                                    ...familyMembers,
                                                    {
                                                        id: uniqueId(),
                                                        firstName: newFamilyFirst,
                                                        lastName: newFamilyLast,
                                                        dob: newFamilyDob,
                                                    },
                                                ],
                                            );
                                            setNewFamilyFirst('');
                                            setNewFamilyLast('');
                                            setNewFamilyDob(undefined);
                                        }
                                    }
                                >
                                    Add family member
                                </Button>
                            </SimpleGrid>
                        </Box>
                    </Box>
                </SimpleGrid>
                <Box m={7} maxWidth="75%">
                    {
                        familyMembers.map((familyMember) => (
                            <SimpleGrid columns={{ sm: 2, md: 4 }} spacing={4} mb={2}>
                                <Input placeholder="First Name" value={familyMember.firstName} disabled />
                                <Input placeholder="Last Name" value={familyMember.lastName} disabled />
                                <DatePicker
                                    required
                                    minDate={moment().subtract(85, 'years').toDate()}
                                    maxDate={new Date()}
                                    value={familyMember.dob}
                                    disabled
                                />
                                <Button
                                    backgroundColor="red"
                                    color="white"
                                    maxWidth={100}
                                    rightIcon={<BsTrash2 />}
                                    onClick={
                                        (e) => {
                                            setFamilyMembers(
                                                familyMembers.filter((a) => a.id !== familyMember.id),
                                            );
                                        }
                                    }
                                >
                                    Remove
                                </Button>
                            </SimpleGrid>
                        ))
                    }
                    <Text fontSize="xs">
                        Family members consist of anyone in a household who is either a child, spouse or domestic
                        partner. Please note: children aged 18 and up must be in the same household, and either a
                        student, active miltary, or disabled adult to be on a family membership. Any children
                        outside of these categories should apply for their own membership, even if they still reside
                        at your address.  Attestation of insurance
                        is required for all family members if your application is accepted.
                    </Text>
                </Box>
                <SimpleGrid m={7}>
                    <Box maxWidth="50%">
                        <Text>Signature</Text>
                        <Text fontSize="2xl" as="em">{`${fullName}`}</Text>
                        <Divider />
                        <Text fontSize="xs">
                            By signing in this field you agree to have your application reviewed by the PRA board
                            (including background searches) as well as to recieve communications via email and
                            text message about your application.
                        </Text>
                    </Box>
                </SimpleGrid>
                <Button
                    backgroundColor="orange.300"
                    color="white"
                    isDisabled={
                        !_.every([firstName, lastName, address, zipCode, city,
                            state, isEmail(email), phoneNumber, birthDate])
                    }
                    onClick={
                        () => {
                            const application = {
                                firstName,
                                lastName,
                                address,
                                city,
                                state,
                                zipCode,
                                email,
                                phoneNumber,
                                birthDate,
                                occupation,
                                referredBy,
                                familyMemberCount,
                                familyMembers,
                            };
                            setApplicationJson(JSON.stringify(application));
                        }
                    }
                    m={5}
                >
                    Submit
                </Button>
            </Box>
            <Textarea value={applicationJson} />
            <SimpleAlertModal message={alertMsg} isOpen={isOpen} onClose={onClose} />
        </ChakraProvider>
    );
}

export default ApplicationForm;
