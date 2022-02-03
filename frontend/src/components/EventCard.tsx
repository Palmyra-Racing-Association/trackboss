import React from 'react';
import { Box, Center, Text, Heading, VStack, HStack, IconButton, Divider } from '@chakra-ui/react';
import { GoKebabVertical } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

interface cardProps {
    date: string,
    startTime: string,
    endTime: string,
    desc: string,
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
                    <Text color="orange" fontSize="3xl">{props.date}</Text>
                    <Text fontSize="2xl">
                        {props.startTime}
                        -
                        {props.endTime}
                    </Text>
                    <Text fontSize="1xl">{props.desc}</Text>
                </VStack>
            </Center>

        </Box>
    );
}
