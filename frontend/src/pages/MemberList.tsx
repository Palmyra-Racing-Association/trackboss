import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme';
import Header from '../components/Header';
import SignUpModal from '../components/SignUpModal';

function MemberList() {
    return (
        <ChakraProvider theme={theme}>
            <Header title="Members" activeButtonId={3} />
            <SignUpModal />
            <SignUpModal />
        </ChakraProvider>
    );
}

export default MemberList;
