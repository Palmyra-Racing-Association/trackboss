import React, { useContext, useEffect, useState } from 'react';
import { Button, Center, ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import ImportantLinksCard from '../components/ImportantLinksCard';
import EventCard from '../components/EventCard';
import { getUpcomingEventData } from '../controller/event';
import { Event } from '../../../src/typedefs/event';
import { getWorkPointsPercentage } from '../controller/workPoints';
import GreetingText from '../components/GreetingText';
import { getName } from '../controller/member';
import { UserContext } from '../contexts/UserContext';

async function getUpcomingEventDataLocal(): Promise<any> {
    const props = await getUpcomingEventData();
    return props;
}

async function getWorkPointsPercentageLocal() {
    const workPointsProps = await getWorkPointsPercentage();
    return workPointsProps;
}

async function getNameLocal() {
    const memberProps = await getName();
    return memberProps;
}

function Dashboard() {
    const [nextEvent, setNextEvent] = useState<Event | null >(null);
    const [percent, setPercent] = useState(0);
    const [memberName, setMemberName] = useState('');
    const { state, update } = useContext(UserContext);
    console.log(state);
    useEffect(() => {
        async function getData() {
            const per = await getWorkPointsPercentageLocal();
            const event = await getUpcomingEventDataLocal();
            const name = await getNameLocal();
            setNextEvent(event);
            setPercent(per);
            setMemberName(name);
        }
        getData();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Dashboard" activeButtonId={1} />
                <GreetingText name={memberName} />
                <Center>
                    <HStack>
                        <WorkPointsCard percent={percent} />
                        {
                            nextEvent ? (
                                <EventCard
                                    date={nextEvent.date}
                                    name={nextEvent.eventName}
                                />
                            ) : (
                                <div />
                            )
                        }
                        <ImportantLinksCard />
                        <Button active onClick={() => update({ loggedIn: true, token: 'test' })}>
                            Log In
                        </Button>
                    </HStack>
                </Center>
            </VStack>
        </ChakraProvider>
    );
}

export default Dashboard;
