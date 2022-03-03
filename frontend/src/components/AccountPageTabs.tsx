import React, { useState } from 'react';
import {
    Button,
    VStack,
    StackDivider,
    Grid,
    GridItem,
    Center,
} from '@chakra-ui/react';

import { BsWrench, BsFillPeopleFill } from 'react-icons/bs';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { IoMdBriefcase } from 'react-icons/io';
import GeneralInfo from './GeneralInfo';
import { Member } from '../../../src/typedefs/member';

const member: Member = {
    memberId: 1,
    membershipAdmin: 'true',
    active: true,
    memberType: 'admin',
    firstName: 'Alan',
    lastName: 'Delimon',
    phoneNumber: '1',
    email: 'user@example.com',
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

export default function HamburgerMenu() {
    const [activeButton, setActiveButton] = useState<Number>(1);

    return (
        <Grid
            h="100vh"
            templateColumns="repeat(4, 1fr)"
            gap={0.5}
            mt={0.5}
        >
            <GridItem
                colSpan={1}
                borderRightWidth={2}
                borderRightColor="lightgray"
            >
                <VStack
                    width="100%"
                    divider={<StackDivider borderColor="gray.300" />}
                    spacing="0"
                >
                    <Button
                        justifyContent="flex-start"
                        height="80px"
                        fontSize="4xl"
                        rightIcon={<BsWrench />}
                        isFullWidth
                        bg="white"
                        color="black"
                        borderRadius="0"
                        _hover={{ bg: 'gray.100' }}
                        _active={
                            {
                                bg: 'orange',
                                color: 'white',
                            }
                        }
                        id="1"
                        isActive={activeButton === 1}
                        onClick={
                            () => {
                                setActiveButton(1);
                            }
                        }
                    >
                        General Info
                    </Button>
                    <Button
                        justifyContent="flex-start"
                        height="80px"
                        fontSize="4xl"
                        rightIcon={<BsFillPeopleFill />}
                        isFullWidth
                        bg="white"
                        color="black"
                        _hover={{ bg: 'gray.100' }}
                        _active={
                            {
                                bg: 'orange',
                                color: 'white',
                            }
                        }
                        borderRadius="0"
                        id="2"
                        isActive={activeButton === 2}
                        onClick={
                            () => {
                                setActiveButton(2);
                            }
                        }
                    >
                        Family & Bikes
                    </Button>
                    <Button
                        justifyContent="flex-start"
                        height="80px"
                        fontSize="4xl"
                        rightIcon={<IoMdBriefcase />}
                        isFullWidth
                        bg="white"
                        color="black"
                        borderRadius="0"
                        _hover={{ bg: 'gray.100' }}
                        _active={
                            {
                                bg: 'orange',
                                color: 'white',
                            }
                        }
                        id="3"
                        isActive={activeButton === 3}
                        onClick={
                            () => {
                                setActiveButton(3);
                            }
                        }
                    >
                        Work Point History
                    </Button>
                    <Button
                        justifyContent="flex-start"
                        height="80px"
                        fontSize="4xl"
                        rightIcon={<FaMoneyBillAlt />}
                        isFullWidth
                        bg="white"
                        color="black"
                        borderRadius="0"
                        _hover={{ bg: 'gray.100' }}
                        _active={
                            {
                                bg: 'orange',
                                color: 'white',
                            }
                        }
                        id="4"
                        isActive={activeButton === 4}
                        onClick={
                            () => {
                                setActiveButton(4);
                            }
                        }
                    >
                        Dues & Waivers
                    </Button>
                </VStack>
            </GridItem>
            <GridItem colSpan={3}>
                {
                    activeButton === 1 && (
                        <GeneralInfo member={member} admin />
                    )
                }
                {
                    activeButton === 2 && (
                        <Center>
                            Family And Bikes Component
                        </Center>
                    )
                }
                {
                    activeButton === 3 && (
                        <Center>
                            Work Points History Component
                        </Center>
                    )
                }
                {
                    activeButton === 4 && (
                        <Center>
                            Dues And Waivers Component
                        </Center>
                    )
                }
            </GridItem>
        </Grid>

    );
}
