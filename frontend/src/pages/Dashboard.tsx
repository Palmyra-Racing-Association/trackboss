import React, { useEffect, useState } from 'react';
import { Center, ChakraProvider, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import { getWorkPointsPercentage } from '../controller/workPoints';
import GreetingText from '../components/GreetingText';
import { getName } from '../controller/member';

async function getWorkPointsPercentageLocal() {
    const workPointsProps = await getWorkPointsPercentage();
    return workPointsProps;
}

async function getNameLocal() {
    const memberProps = await getName();
    return memberProps;
}

function Dashboard() {
    const [percent, setPercent] = useState(0);
    const [memberName, setMemberName] = useState('');
    useEffect(() => {
        async function getPercent() {
            const per = await getWorkPointsPercentageLocal();
            setPercent(per);
        }
        getPercent();

        async function getMemberName() {
            const memProps = await getNameLocal();
            setMemberName(memProps.name);
        }
        getMemberName();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <VStack align="left" spacing="2em">
                <Header title="Dashboard" activeButtonId={1} />
                <GreetingText name={memberName} />
                <Center>
                    <HStack>
                        <WorkPointsCard percent={percent} />
                    </HStack>
                </Center>
            </VStack>
        </ChakraProvider>
    );
}

export default Dashboard;
