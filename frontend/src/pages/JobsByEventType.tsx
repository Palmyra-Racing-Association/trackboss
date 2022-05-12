import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import EventSignupSheet from '../components/EventSignupSheet';

function JobsByEventType() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Jobs by Event Type" activeButtonId={5} />
            <EventSignupSheet />
        </ChakraProvider>
    );
}

export default JobsByEventType;
