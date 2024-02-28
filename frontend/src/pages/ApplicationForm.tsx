/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import {
    Box, Button, ChakraProvider, Image, Input, InputGroup, InputLeftAddon, SimpleGrid, Text,
} from '@chakra-ui/react';
import { isEmail, isMobilePhone } from 'validator';
import Autocomplete from 'react-google-autocomplete';
import DatePicker from 'react-date-picker';
import moment from 'moment';

import theme from '../theme';

function ApplicationForm() {
    const [season, setSeason] = useState<number>();

    const [firstName, setFirstName] = useState<string>();
    const [streetAddress, setStreetAddress] = useState<string>();
    const [zipCode, setZipCode] = useState<string>();
    const [city, setCity] = useState<string>();
    const [state, setState] = useState<string>();
    const [phoneNumber, setPhoneNumber] = useState<string>();
    const [birthDate, setBirthDate] = useState<Date>();
    const [occupation, setOccupation] = useState<string>();
    const [referredBy, setReferredBy] = useState<string>();

    const eightteenYearsAgo = moment().subtract(18, 'years').toDate();
    useEffect(() => {
        const date = new Date();
        const month = date.getMonth();
        if (month >= 2) {
            setSeason(date.getFullYear() + 1);
        } else {
            setSeason(date.getFullYear());
        }
    });

    return (
        <ChakraProvider theme={theme}>
            <Box mt={0} pt={0} borderWidth="5 px" width="90%" backgroundColor="white">
                <SimpleGrid columns={2} maxWidth={800} m={5}>
                    <Box maxW={200}>
                        <Image width={200} height={90} src="logo192.png" />
                    </Box>
                    <Text fontSize="2xl">{`Palmyra Racing Association Application - ${season} season`}</Text>
                </SimpleGrid>
                <Box paddingBottom={5} m={5}>
                    <Text>
                        Please complete all sections. Note that when your application is accepted we will need payment,
                        waiver of liability, minor waivers, and health insurance information. We do not need any of
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
                        <Text>First Name</Text>
                        <Input />
                    </Box>
                    <Box m={2}>
                        <Text>Last Name</Text>
                        <Input />
                    </Box>
                </SimpleGrid>
                <SimpleGrid m={5}>
                    <Box m={2}>
                        <Text>Street Address</Text>
                        <Autocomplete
                            style={
                                {
                                    width: '50%',
                                    font: 'Russo One',
                                    padding: '12px 20px',
                                    margin: '8px 0;',
                                    display: 'inline-block',
                                    border: '1px solid #ccc',
                                    borderRadius: '0.375rem',
                                }
                            }
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
                                    setStreetAddress(mapsStreetAddress);
                                    setZipCode(mapsZipCode);
                                }
                            }
                        />
                    </Box>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 2 }} m={5}>
                    <Box m={2}>
                        <Text>Phone</Text>
                        <InputGroup>
                            <InputLeftAddon>
                                +1
                            </InputLeftAddon>
                            <Input
                                type="tel"
                                isRequired
                                onChange={
                                    (e) => {
                                        let enteredPhone = e.target.value;
                                        if (enteredPhone.length >= 10) {
                                            enteredPhone = enteredPhone.replace(/-/gi, '');
                                            enteredPhone = enteredPhone.replace(/\./gi, '');
                                            e.target.value = enteredPhone;
                                            e.target.value = `${enteredPhone}`;
                                            setPhoneNumber(`+1${enteredPhone}`);
                                        }
                                    }
                                }
                            />
                        </InputGroup>
                    </Box>
                    <Box m={2}>
                        <Text>eMail</Text>
                        <Input />
                    </Box>
                </SimpleGrid>
                <SimpleGrid columns={{ sm: 1, md: 3 }} m={5}>
                    <Box m={2}>
                        <Text>Date of Birth</Text>
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
                        <Input />
                    </Box>
                    <Box m={2}>
                        <Text>Referred By</Text>
                        <Input />
                    </Box>
                </SimpleGrid>
                <Button
                    backgroundColor="orange.300"
                    color="white"
                    m={5}
                >
                    Submit
                </Button>
            </Box>
        </ChakraProvider>
    );
}

export default ApplicationForm;
