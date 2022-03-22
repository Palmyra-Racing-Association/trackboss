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

async function getUpcomingEventDataLocal(token: string): Promise<Event | undefined> {
    // Creates a string with today's date in YYYYMMDD format
    const now = new Date();
    const nowString = now.toISOString().slice(0, 10).replace(/-/g, '');
    const props = await getUpcomingEventData(token, `${nowString}-`);
    return props;
}

function Dashboard() {
    const { state } = useContext(UserContext);
    const [nextEvent, setNextEvent] = useState<Event>();
    const [percent, setPercent] = useState<number>();
    useEffect(() => {
        async function getData() {
            if (state.user) {
                setPercent(await getWorkPointsPercentage(state.token, state.user.memberId));
            }
            setNextEvent(await getUpcomingEventDataLocal(state.token));
        }
        getData();
    }, [state.user]);

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
                        {
                            percent && (
                                <WorkPointsCard percent={percent} />
                            )
                        }
                        {
                            nextEvent && (
                                <EventCard
                                    date={nextEvent.start}
                                    name={nextEvent.title}
                                />
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
