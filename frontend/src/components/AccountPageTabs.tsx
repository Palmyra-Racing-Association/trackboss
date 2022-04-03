import React, { useState, useContext, useEffect } from 'react';
import {
    Button,
    StackDivider,
    Box,
    Center,
    SimpleGrid,
    HStack,
} from '@chakra-ui/react';

import { BsWrench, BsFillPeopleFill } from 'react-icons/bs';
import { FaMoneyBillAlt } from 'react-icons/fa';
import { IoMdBriefcase } from 'react-icons/io';
import { UserContext } from '../contexts/UserContext';
import GeneralInfo from './GeneralInfo';
import FamilyAndBikes from './FamilyAndBikes';
import { GetMemberListResponse, Member } from '../../../src/typedefs/member';
import WorkPointsHistory from './WorkPointsHistory';
import { GetBikeListResponse } from '../../../src/typedefs/bike';
import { getFamilyMembers } from '../controller/member';
import { getBikeList } from '../controller/bike';

async function getMemberFamilyLocal(token: string, membershipId: number) {
    let family = await getFamilyMembers(token, membershipId);
    family = (family as Member[]).filter((m) => m.active);
    return family;
}

async function getMemberBikesLocal(token: string, membershipId: number) {
    const bikes = await getBikeList(token, membershipId);
    return bikes;
}

export default function AccountPageTabs() {
    const { state } = useContext(UserContext);
    const [activeButton, setActiveButton] = useState<Number>(1);
    const [memberFamily, setMemberFamily] = useState<GetMemberListResponse>([]);
    const [memberBikes, setMemberBikes] = useState<GetBikeListResponse>([]);
    useEffect(() => {
        async function setMemberData() {
            if (state.user) {
                const family: GetMemberListResponse = await getMemberFamilyLocal(state.token, state.user.membershipId);
                const bikes: GetBikeListResponse = await getMemberBikesLocal(state.token, state.user.membershipId);
                setMemberFamily(family);
                setMemberBikes(bikes);
            }
        }
        setMemberData();
    }, []);

    return (
        <SimpleGrid>
            <Box>
                <HStack
                    divider={<StackDivider borderColor="gray.300" />}
                    spacing="0"
                >
                    <Button
                        justifyContent="flex-start"
                        fontSize="m"
                        width="25%"
                        rightIcon={<BsWrench />}
                        bg="white"
                        color="black"
                        borderRadius="0"
                        variant="outline"
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
                        fontSize="m"
                        width="25%"
                        rightIcon={<BsFillPeopleFill />}
                        bg="white"
                        color="black"
                        variant="outline"
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
                        fontSize="m"
                        width="25%"
                        rightIcon={<IoMdBriefcase />}
                        bg="white"
                        color="black"
                        variant="outline"
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
                        fontSize="m"
                        width="25%"
                        rightIcon={<FaMoneyBillAlt />}
                        bg="white"
                        color="black"
                        variant="outline"
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
                </HStack>
            </Box>
            <Box>
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
            </Box>
        </SimpleGrid>
    );
}
