import React, { useState } from 'react';
import { Box, Center, Text, Heading, VStack, HStack, IconButton, Divider, Button } from '@chakra-ui/react';
import { GoCalendar } from 'react-icons/go';
import { useNavigate } from 'react-router-dom';

interface cardProps {
    signupHandler: () => void,
    date: string,
    startTime: string,
    name: string,
    endDate: string,
    id: number,
    allowsSignIn: boolean,
}

export default function EventCard(props: cardProps) {
    const navigate = useNavigate();
    const navigateToCalendar = () => {
        const path = '/calendar';
        navigate(path);
    };
    const singleDayEvent = (props.date === props.endDate);
    let eventDates = `${props.date} - ${props.endDate}`;
    if (singleDayEvent) {
        eventDates = props.date;
    }
    const DISABLE_EVENT_SIGNIN_BUTTON = 'disableSigninButton';
    const [disableSignInButton, setDisableSignInButton] =
        useState<boolean>(!!(sessionStorage.getItem(DISABLE_EVENT_SIGNIN_BUTTON)));

    return (
        <Box
            cursor="pointer"
            bg="white"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
            p={3}
            m={2}
            h="365"
        >
            <Center>
                <VStack
                    p={0}
                    boxSize="md"
                    onClick={navigateToCalendar}
                >
                    <HStack>
                        <IconButton
                            aria-label="Calendar"
                            size="sm"
                            variant="ghost"
                            p="0"
                            m="0"
                            fontSize="24px"
                            color="gray.200"
                            icon={<GoCalendar />}
                        />
                        <Heading pr={5} size="lg">Next Event</Heading>
                    </HStack>
                    <Divider />
                    <Text pt={10} color="orange" fontSize="2xl">
                        {eventDates}
                    </Text>
                    <Text fontSize="2xl">{props.startTime}</Text>
                    <Text fontSize="2xl">{props.name}</Text>
                    <Button
                        backgroundColor="orange.300"
                        color="white"
                        disabled={disableSignInButton}
                        hidden={!props.allowsSignIn}
                        onClick={
                            (e) => {
                                sessionStorage.setItem(DISABLE_EVENT_SIGNIN_BUTTON, 'true');
                                props.signupHandler();
                                setDisableSignInButton(true);
                                e.stopPropagation();
                            }
                        }
                    >
                        Sign in
                    </Button>
                    <Text fontSize="xx-small">
                        EventID:
                        {props.id}
                    </Text>
                </VStack>
            </Center>
        </Box>
    );
}
