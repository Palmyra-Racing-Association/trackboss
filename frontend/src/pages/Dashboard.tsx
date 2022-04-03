import React, { useEffect, useState, useContext } from 'react';
import { ChakraProvider, Center, SimpleGrid, VStack } from '@chakra-ui/react';
import { UserContext } from '../contexts/UserContext';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import ImportantLinksCard from '../components/ImportantLinksCard';
import EventCard from '../components/EventCard';
import { getEventCardProps } from '../controller/event';
import { getWorkPointsTotal } from '../controller/workPoints';
import { getYearlyThresholdValue } from '../controller/billing';
import GreetingText from '../components/GreetingText';
import { getTodaysDate } from '../controller/utils';

async function getEventCardPropsLocal(token: string): Promise<any | undefined> {
    const nowString = getTodaysDate();
    const props = await getEventCardProps(token, `${nowString}-`);
    return props;
}

async function getWorkPointsPercentage(token: string, memberId: number) {
    const workPoints = await getWorkPointsTotal(token, memberId);
    const threshold = await getYearlyThresholdValue(token);
    if (workPoints && threshold) {
        return Math.ceil((workPoints / threshold) * 100);
    }
    // else
    return -1;
}

function Dashboard() {
    const { state } = useContext(UserContext);
    const [eventCardProps, setEventCardProps] = useState<any>();
    const [percent, setPercent] = useState<number>(0);
    useEffect(() => {
        async function getData() {
            setEventCardProps(await getEventCardPropsLocal(state.token));
            if (state.user) {
                setPercent(await getWorkPointsPercentage(state.token, state.user.memberId));
            }
        }
        getData();
    }, [state.user]);

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Dashboard" activeButtonId={1} />
                {
                    state.user && (
                        <GreetingText name={`${state.user.firstName} ${state.user.lastName}`} />
                    )
                }
                <Center>
                    <SimpleGrid columns={[1, null, 3]} spacing="20px">
                        <WorkPointsCard percent={percent} />
                        {
                            eventCardProps ? (
                                <EventCard
                                    date={eventCardProps.start}
                                    startTime={eventCardProps.time}
                                    name={eventCardProps.title}
                                />
                            ) : (
                                <EventCard
                                    date=""
                                    startTime=""
                                    name=""
                                />
                            )
                        }
                        <ImportantLinksCard />
                    </SimpleGrid>
                </Center>
            </VStack>
        </ChakraProvider>
    );
}

export default Dashboard;
