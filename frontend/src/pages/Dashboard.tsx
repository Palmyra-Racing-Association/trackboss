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
import { getGateCodeLatest } from '../controller/gateCode';
import { GateCode } from '../../../src/typedefs/gateCode';
import TrackStatusCard from '../components/TrackStatusCard';
import { getRidingAreaStatuses, updateRidingAreaStatus } from '../controller/ridingAreaStatus';
import { RidingAreaStatus } from '../../../src/typedefs/ridingAreaStatus';

async function getEventCardPropsLocal(token: string): Promise<any | undefined> {
    const nowString = getTodaysDate();
    const props = await getEventCardProps(token, `${nowString}-`);
    return props;
}

async function getWorkPointsPercentage(token: string, membershipId: number) {
    const workPoints = await getWorkPointsTotal(token, membershipId);
    const threshold = await getYearlyThresholdValue(token);
    if (workPoints && threshold) {
        return Math.ceil((workPoints / threshold) * 100);
    }
    // else
    return 0;
}

function Dashboard() {
    const { state } = useContext(UserContext);
    const [eventCardProps, setEventCardProps] = useState<any>();
    const [percent, setPercent] = useState<number>(0);
    const [gateCode, setGateCode] = useState<string>('');
    const [ridingAreaStatuses, setRidingAreaStatuses] = useState<RidingAreaStatus[]>([]);

    async function loadTrackStatuses() {
        const statuses = await getRidingAreaStatuses(state.token);
        setRidingAreaStatuses(statuses);
    }

    useEffect(() => {
        async function getData() {
            setEventCardProps(await getEventCardPropsLocal(state.token));
            if (state.user) {
                setPercent(await getWorkPointsPercentage(state.token, state.user.membershipId));
            }
            await loadTrackStatuses();
        }
        getData();
    }, [state.user]);

    useEffect(() => {
        async function getData() {
            const latestGateCode = await getGateCodeLatest(state.token) as GateCode;
            setGateCode(latestGateCode.gateCode);
        }
        getData();
    });

    async function updateArea(updatedArea: RidingAreaStatus) {
        await updateRidingAreaStatus(state.token, (updatedArea.id || 0), updatedArea);
        await loadTrackStatuses();
    }

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Track Boss Dashboard" activeButtonId={1} />
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
                                    endDate={eventCardProps.end}
                                />
                            ) : (
                                <EventCard
                                    date=""
                                    startTime=""
                                    name=""
                                    endDate=""
                                />
                            )
                        }
                        <ImportantLinksCard gateCode={gateCode} />
                    </SimpleGrid>
                </Center>
            </VStack>
            <Center>
                <TrackStatusCard
                    areaStatusList={ridingAreaStatuses}
                    isAdmin={state.user?.memberType === 'Admin'}
                    // eslint-disable-next-line react/jsx-no-bind
                    updateArea={updateArea}
                />
            </Center>
        </ChakraProvider>
    );
}

export default Dashboard;
