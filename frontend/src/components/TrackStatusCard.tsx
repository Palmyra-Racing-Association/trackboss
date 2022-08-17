import React from 'react';
import { Box, Divider, Heading, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { RidingAreaStatus } from '../../../src/typedefs/ridingAreaStatus';

interface cardProps {
    areaStatusList: RidingAreaStatus[],
}

export default function TrackStatusCard(props: cardProps) {
    const { areaStatusList } = props;

    const ridingAreaDisplay = areaStatusList.map((area) => {
        let color = '';
        if (area.isOpen) {
            color = 'green';
        } else {
            color = 'red';
        }
        return (
            <Box bgColor={color} color="white" w="100%">
                <Text fontSize="xl" fontStyle="bold">
                    {area.name}
                </Text>
            </Box>
        );
    });
    return (
        <Box
            alignSelf="center"
            bg="white"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            w={[470, 470, '99%']}
            p={3}
            m={2}
        >
            <VStack align="left" spacing="2em">
                <Heading alignContent="left" size="lg">Track Status</Heading>
                <Divider />
                <HStack>
                    <SimpleGrid w="100%" columns={[1, null, 3]} spacing="20px">
                        {ridingAreaDisplay}
                    </SimpleGrid>
                </HStack>
            </VStack>
        </Box>
    );
}
