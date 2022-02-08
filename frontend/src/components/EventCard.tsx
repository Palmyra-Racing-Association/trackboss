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
            bg="white"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            p={3}
            height={333}
        >
            <Center>
                <VStack p={0}>
                    <HStack>
                        <IconButton
                            aria-label="Calendar"
                            size="xs"
                            variant="ghost"
                            p="0"
                            m="0"
                            fontSize="24px"
                            color="gray.200"
                            icon={<GoKebabVertical />}
                        />
                        <Heading>Next Event</Heading>
                    </HStack>
                    <Divider />
                    <Text pt={5} color="orange" fontSize="5xl">{props.date}</Text>
                    {/* TODO: this should come from props once the API is updated */}
                    <Text fontSize="2xl">5pm-7pm</Text>
                    <Text fontSize="2xl">{props.name}</Text>
                </VStack>
            </Center>

        </Box>
    );
}
