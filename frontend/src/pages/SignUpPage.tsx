import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, ChakraProvider } from '@chakra-ui/react';
import Header from '../components/Header';
import theme from '../theme';
import SignUpList from '../components/SignUpList';

type pageParams = {
    date: string,
    eventId: string,
    eventType: string,
};

export default function SignUpPage() {
    const { date, eventId, eventType } = useParams<pageParams>();
    return (
        <ChakraProvider theme={theme}>
            <Header title={`${eventType} Sign Ups for (${date})`} activeButtonId={2} />
            <Box>
                <SignUpList eventId={Number(eventId)} eventType={eventType as string} />
            </Box>
        </ChakraProvider>
    );
}
