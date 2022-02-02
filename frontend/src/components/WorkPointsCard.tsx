/* eslint-disable */
import React from 'react';
import GaugeChart from 'react-gauge-chart';
import { Box, Center, Text, VStack } from '@chakra-ui/react';

interface cardProps {
    percent: number,
}

export default function WorkPointsCard(props: cardProps) {
    return (
        <Box bg="white" boxShadow="md" border="1px" borderColor="gray.200">
            <Center>
                <VStack>
                    <GaugeChart
                        hideText
                        id="gauge-chart"
                        nrOfLevels={20}
                        percent={0.86}
                        colors={['#FF9F46', '#76CE6F']}
                    />
                    <Text>You have completed</Text>
                    <Text color='orange' fontSize='5xl'>{props.percent}%</Text>
                    <Text>of this year's work points</Text>
                </VStack>   
            </Center>
           


        </Box>
    );
}
