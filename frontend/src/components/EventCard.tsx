import React from 'react';
import { Box, Center, Text, Heading, VStack, HStack, IconButton, Divider } from '@chakra-ui/react';
import { GoKebabVertical } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

interface cardProps {
    date: string,
    name: string,
}

export default function EventCard(props: cardProps) {
    const navigate = useNavigate();
    const navigateToCalendar = () => {
        const path = '/calendar';
        navigate(path);
    };

    return (
        <Box
            onClick={navigateToCalendar}
            cursor="pointer"
            bg="white"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            p={3}
            maxWidth={300}
        >
            <Center>
                <VStack p={0} boxSize="md">
                    <HStack>
                        <IconButton
                            aria-label="Calendar"
                            size="sm"
                            variant="ghost"
                            p="0"
                            m="0"
                            fontSize="24px"
                            color="gray.200"
                            icon={<GoKebabVertical />}
                        />
                        <Heading pr={5}>Next Event</Heading>
                    </HStack>
                    <Divider />
                    <Text pt={10} pb={10} color="orange" fontSize="6xl">{props.date}</Text>
                    {/* TODO: this should come from props once the API is updated */}
                    <Text fontSize="4xl">Starts at 5pm</Text>
                    <Text fontSize="4xl">{props.name}</Text>
                </VStack>
            </Center>

        </Box>
    );
}
