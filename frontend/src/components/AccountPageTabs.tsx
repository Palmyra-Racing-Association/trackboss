import React, { useState, useContext, useEffect } from 'react';
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
import { UserContext } from '../contexts/UserContext';
import GeneralInfo from './GeneralInfo';
import FamilyAndBikes from './FamilyAndBikes';
import { Member } from '../../../src/typedefs/member';
import WorkPointsHistory from './WorkPointsHistory';
import { Bike } from '../../../src/typedefs/bike';
import { getFamilyMembers } from '../controller/member';

const memberFamily: Member[] = [
    {
        memberId: 1,
        membershipAdmin: 'true',
        active: true,
        memberType: 'admin',
        firstName: 'John',
        lastName: 'Smith',
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
    },
    {
        memberId: 2,
        membershipAdmin: 'true',
        active: true,
        memberType: 'admin',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '2',
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
    },
];

const memberBikes: Bike[] = [
    {
        bikeId: 1,
        year: '2012',
        make: 'honda',
        model: 'rust-bucket',
        membershipAdmin: 'string',
    },
    {
        bikeId: 2,
        year: '2022',
        make: 'yamaha',
        model: '',
        membershipAdmin: 'string',
    },
];

async function getMemberFamilyLocal(token: string, membershipId: string) {
    const family = await getFamilyMembers(token);
}


export default function AccountPageTabs() {
    const { state } = useContext(UserContext);
    const [activeButton, setActiveButton] = useState<Number>(1);
    const [memberFamily, setMemberFamily] = useState<Member[]>([]);
    const [memberBikes, setMemberBikes] = useState<Bike[]>([]);
    useEffect(() => {
        async function setMemberData() {
            const family = await getMemberFamilyLocal(state.token, );
        }
        setMemberData();
    }, [props.memberFamily, props.memberBikes]);

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
                    activeButton === 1 && state.user && (
                        <GeneralInfo user={state.user} />
                    )
                }
                {
                    activeButton === 2 && state.user && (
                        <FamilyAndBikes
                            memberBikes={memberBikes}
                            memberFamily={memberFamily}
                            admin={state.user.memberType === 'Admin'}
                        />
                    )
                }
                {
                    activeButton === 3 && state.user && (
                        <WorkPointsHistory />
                    )
                }
                {
                    activeButton === 4 && state.user && (
                        <Center>
                            Dues And Waivers Component
                        </Center>
                    )
                }
            </GridItem>
        </Grid>

    );
}
