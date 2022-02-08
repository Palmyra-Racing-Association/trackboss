import React, { useEffect, useState } from 'react';
import { Center, ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import EventCard from '../components/EventCard';
import { getUpcomingEventData } from '../controller/event';
import { Event } from '../../../src/typedefs/event';

async function getUpcomingEventDataLocal(): Promise<any> {
    const props = await getUpcomingEventData();
    return props;
}

function Dashboard() {
    const [nextEvent, setNextEvent] = useState<Event | null>(null);
    useEffect(() => {
        async function getEvent() {
            const event = await getUpcomingEventDataLocal();
            setNextEvent(event);
        }
        getEvent();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Dashboard" activeButtonId={1} />
                <Center>
                    <HStack>
                        <WorkPointsCard percent={67} />
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

                    </HStack>
                </Center>
            </VStack>

        </ChakraProvider>
    );
}

export default Dashboard;
