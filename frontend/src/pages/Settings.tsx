import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';

function Settings() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="General Info" activeButtonId={4} />
        </ChakraProvider>
    );
}

export default Settings;
