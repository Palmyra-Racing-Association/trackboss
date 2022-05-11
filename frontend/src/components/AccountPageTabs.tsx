import React, { useState, useContext, useEffect } from 'react';
import {
    Tabs,
    Tab,
    TabPanel,
    TabPanels,
    TabList,
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
        <Tabs variant="soft-rounded" bg="white" colorScheme="orange">
            <TabList>
                <Tab>
                    General Info &nbsp;
                    <BsWrench />
                </Tab>
                <Tab>
                    Family & Bikes &nbsp;
                    <BsFillPeopleFill />
                </Tab>
                <Tab>
                    Work Point History &nbsp;
                    <IoMdBriefcase />
                </Tab>
                <Tab>
                    Dues & Waivers &nbsp;
                    <FaMoneyBillAlt />
                </Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    {
                        state.user &&
                        <GeneralInfo user={state.user} />
                    }
                </TabPanel>
                <TabPanel>
                    {
                        state.user && (
                            <FamilyAndBikes
                                memberBikes={memberBikes}
                                memberFamily={memberFamily}
                                admin={state.user.memberType.includes('Admin')}
                            />
                        )
                    }
                </TabPanel>
                <TabPanel>
                    <WorkPointsHistory />
                </TabPanel>
                <TabPanel>
                    Dues and Waivers Component
                </TabPanel>
            </TabPanels>
        </Tabs>
    );
}
