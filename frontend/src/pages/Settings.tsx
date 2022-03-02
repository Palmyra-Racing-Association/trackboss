import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import AccountPageTabs from '../components/AccountPageTabs';

function Settings() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="My Account" activeButtonId={4} />
            <AccountPageTabs />
        </ChakraProvider>
    );
}

export default Settings;
