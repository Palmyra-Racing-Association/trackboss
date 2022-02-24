/* eslint-disable */
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import SignUpList from '../components/SignUpList';
import VerifyButton from '../components/VerifyButton';

function Settings() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="General Info" activeButtonId={4} />
            <SignUpList />
        </ChakraProvider>
    );
}

export default Settings;
