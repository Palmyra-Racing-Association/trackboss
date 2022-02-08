import React, { useEffect, useState } from 'react';
import { Center, ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import EventCard from '../components/EventCard';
import { getMostRecentEventData } from '../controller/event';

async function getMostRecentEventDataLocal(): Promise<any> {
    const props = await getMostRecentEventData();
    // const anotherOne = Promise.resolve(props);
    return props;
}

function Dashboard() {
    const [nextEvent, setNextEvent] = useState(null);
    useEffect(() => {
        async function getEvent() {
            event = await getMostRecentEventDataLocal();
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
                                    name={nextEvent.event_name}
                                />
                            ) : (
                                <EventCard
                                    date="error"
                                    name="error"
                                />
                            )
                        }

                    </HStack>
                </Center>
            </VStack>

        </ChakraProvider>
    );
}

export default Dashboard;
