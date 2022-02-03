/* eslint-disable */
import React from 'react';
import { Box, Center, ChakraProvider, Grid, GridItem, HStack, VStack } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import WorkPointsCard from '../components/WorkPointsCard';
import EventCard from '../components/EventCard';

function Dashboard() {
    return (
        <ChakraProvider theme={theme}>
                <VStack align="left" spacing='2em'>
                    <Header title='Dashboard' activeButtonId={1} />
                    <Center>
                        <HStack>
                            <WorkPointsCard percent={67}/>
                            <EventCard date={"Oct 8th"} startTime={"6:30pm"} endTime={"7:30pm"} desc={"Work Day"}/>
                        </HStack>
                    </Center>       
                </VStack>

           
            
        </ChakraProvider>
    );
}

export default Dashboard;
