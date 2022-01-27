import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';

function CalendarPage() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Calendar" activeButtonId={2} />
        </ChakraProvider>
    );
}

export default CalendarPage;
