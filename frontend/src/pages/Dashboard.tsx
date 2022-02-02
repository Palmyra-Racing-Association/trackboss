/* eslint-disable */
import React from 'react';
import { Box, Center, ChakraProvider, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import ImportantLinksCard from '../components/ImportantLinksCard'

function Dashboard() {
    return (
        <ChakraProvider theme={theme}>
                <VStack align="left" spacing='2em'>
                    <Header title='Dashboard' activeButtonId={1} />
                    <Center>
                        <HStack>
                            <WorkPointsCard percent={67}/>
                            <ImportantLinksCard />
                        </HStack>
                    </Center>       
                </VStack>

           
            
        </ChakraProvider>
    );
}

export default Dashboard;
