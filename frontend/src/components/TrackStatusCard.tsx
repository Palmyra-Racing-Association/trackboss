import React from 'react';
import { Box, Divider, Heading, HStack, SimpleGrid, VStack } from '@chakra-ui/react';

export default function TrackStatusCard() {
    return (
        <Box
            alignSelf="center"
            bg="white"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            w={[470, 470, 1250]}
            p={3}
            m={2}
        >
            <VStack align="left" spacing="2em">
                <Heading alignContent="left" size="lg">Track Status</Heading>
                <Divider />
                <HStack>
                    <SimpleGrid columns={[1, null, 3]} spacing="20px">
                        <Box>Main Track</Box>
                        <Box>Mini Track</Box>
                        <Box>Woods Course</Box>
                    </SimpleGrid>
                </HStack>
            </VStack>
        </Box>
    );
}
