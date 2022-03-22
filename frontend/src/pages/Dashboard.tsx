import React, { useEffect, useState, useContext } from 'react';
import { Center, ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import { UserContext } from '../contexts/UserContext';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import ImportantLinksCard from '../components/ImportantLinksCard';
import EventCard from '../components/EventCard';
import { getUpcomingEventData } from '../controller/event';
import { Event } from '../../../src/typedefs/event';
import { getWorkPointsPercentage } from '../controller/workPoints';
import GreetingText from '../components/GreetingText';

async function getUpcomingEventDataLocal(): Promise<any> {
    const props = await getUpcomingEventData();
    return props;
}

async function getWorkPointsPercentageLocal() {
    const workPointsProps = await getWorkPointsPercentage();
    return workPointsProps;
}

function Dashboard() {
    const { state } = useContext(UserContext);
    const [nextEvent, setNextEvent] = useState<Event | null >(null);
    const [percent, setPercent] = useState(0);
    useEffect(() => {
        async function getData() {
            const per = await getWorkPointsPercentageLocal();
            const event = await getUpcomingEventDataLocal();
            setNextEvent(event);
            setPercent(per);
        }
        getData();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Dashboard" activeButtonId={1} />
                {
                    state.user && (
                        <GreetingText name={`${state.user?.firstName} ${state.user?.lastName}`} />
                    )
                }
                <Center>
                    <HStack>
                        <WorkPointsCard percent={percent} />
                        {
                            nextEvent ? (
                                <EventCard
                                    date={nextEvent.start}
                                    name={nextEvent.title}
                                />
                            ) : (
                                <div />
                            )
                        }
                        <ImportantLinksCard />
                    </HStack>
                </Center>
            </VStack>
        </ChakraProvider>
    );
}

export default Dashboard;
