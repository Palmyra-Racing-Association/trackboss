import React from 'react';
import { ChakraProvider, HStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';

function Dashboard() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Dashboard" activeButtonId={1} />
            <HStack>
                <WorkPointsCard />
            </HStack>
        </ChakraProvider>
    );
}

export default Dashboard;
